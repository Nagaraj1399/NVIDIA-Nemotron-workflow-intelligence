/**
 * FlowPilot AI - Full Stack Server
 * Express API backend + Vite middleware dev server
 * Port 3000
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';
import { nebiusClient } from './server/models/nebiusClient.js';
import { workflowPlanner } from './server/orchestration/planner.js';
import { workflowOrchestrator } from './server/orchestration/orchestrator.js';
import { integrationHealthService } from './server/services/healthService.js';
import { Workflow, WorkflowTask } from './server/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// --- API ROUTES ---

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    app: 'FlowPilot AI',
    activeModel: process.env.NEBIUS_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct'
  });
});

// 2. Model Status & Test
app.get('/api/models/status', (req, res) => {
  const info = nebiusClient.getProviderInfo();
  res.json(info);
});

app.post('/api/models/test', async (req, res) => {
  try {
    const testResult = await nebiusClient.testConnection();
    res.json(testResult);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Plan Generation
app.post('/api/workflows/plan', async (req, res) => {
  try {
    const { objective, context, referenceUrls, outputFormat, constraints, maxTasks, model } = req.body;
    if (!objective || typeof objective !== 'string' || objective.trim().length === 0) {
      return res.status(400).json({ error: 'Objective is required' });
    }

    const plan = await workflowPlanner.generatePlan({
      objective: objective.trim(),
      context,
      referenceUrls,
      outputFormat,
      constraints,
      maxTasks: Number(maxTasks) || 6,
      model
    });

    res.json(plan);
  } catch (err: any) {
    console.error('Plan generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate plan' });
  }
});

// 4. Workflows CRUD & Execution
app.get('/api/workflows', (req, res) => {
  const workflows = db.getWorkflows();
  res.json(workflows);
});

app.post('/api/workflows', async (req, res) => {
  try {
    const { title, objective, context, referenceUrls, outputFormat, constraints, tasks, approvalRequired, maxTasks, modelUsed } = req.body;

    if (!objective || !title || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Title, objective, and valid tasks array are required' });
    }

    const workflowId = 'wf_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const formattedTasks: WorkflowTask[] = tasks.map((t: any, index: number) => ({
      id: t.id || `task_${index + 1}`,
      workflowId,
      title: t.title || `Task ${index + 1}`,
      description: t.description || '',
      tool: t.tool || 'tavily_search',
      dependencies: Array.isArray(t.dependencies) ? t.dependencies : [],
      status: 'pending',
      input: t.input || {},
      retryCount: 0,
      maxRetries: 2,
      requiresApproval: Boolean(t.requiresApproval)
    }));

    const workflow: Workflow = {
      id: workflowId,
      title,
      objective,
      context,
      referenceUrls,
      outputFormat,
      constraints,
      status: 'draft',
      modelUsed: modelUsed || process.env.NEBIUS_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct',
      approvalRequired: Boolean(approvalRequired),
      maxTasks: Number(maxTasks) || formattedTasks.length,
      tasks: formattedTasks,
      createdAt: now,
      updatedAt: now
    };

    db.saveWorkflow(workflow);
    db.addEvent({
      workflowId,
      type: 'workflow_created',
      message: `Workflow created: "${workflow.title}" with ${workflow.tasks.length} tasks`
    });

    // Auto-start if no approval required upfront, or wait for explicit approval
    if (!workflow.approvalRequired) {
      workflowOrchestrator.executeWorkflow(workflowId);
    } else {
      workflow.status = 'ready_for_approval';
      db.saveWorkflow(workflow);
    }

    res.status(201).json(workflow);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create workflow' });
  }
});

app.get('/api/workflows/:id', (req, res) => {
  const workflow = db.getWorkflow(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json(workflow);
});

app.delete('/api/workflows/:id', (req, res) => {
  const success = db.deleteWorkflow(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json({ success: true, message: 'Workflow deleted' });
});

app.post('/api/workflows/:id/approve', async (req, res) => {
  const workflow = db.getWorkflow(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  workflow.status = 'approved';
  db.saveWorkflow(workflow);
  db.addEvent({
    workflowId: workflow.id,
    type: 'plan_approved',
    message: 'Workflow plan approved by user. Initiating execution.'
  });

  workflowOrchestrator.executeWorkflow(workflow.id);
  res.json(workflow);
});

app.post('/api/workflows/:id/task/:taskId/approve', (req, res) => {
  const { id, taskId } = req.params;
  const success = workflowOrchestrator.approveTask(id, taskId);
  if (!success) {
    return res.status(400).json({ error: 'Could not approve task. Check status.' });
  }
  const updated = db.getWorkflow(id);
  res.json(updated);
});

app.post('/api/workflows/:id/cancel', (req, res) => {
  const success = workflowOrchestrator.cancelWorkflow(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  const updated = db.getWorkflow(req.params.id);
  res.json(updated);
});

app.post('/api/workflows/:id/retry', (req, res) => {
  const success = workflowOrchestrator.retryFailedTasks(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  const updated = db.getWorkflow(req.params.id);
  res.json(updated);
});

app.get('/api/workflows/:id/events', (req, res) => {
  const events = db.getEvents(req.params.id);
  res.json(events);
});

app.get('/api/workflows/:id/report', (req, res) => {
  const workflow = db.getWorkflow(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  if (!workflow.reportId) {
    return res.status(404).json({ error: 'Report not generated yet for this workflow' });
  }
  const report = db.getReport(workflow.reportId);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

// 5. Reports
app.get('/api/reports', (req, res) => {
  const reports = db.getReports();
  res.json(reports);
});

app.get('/api/reports/:id', (req, res) => {
  const report = db.getReport(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

// 6. Integrations
app.get('/api/integrations', async (req, res) => {
  const list = await integrationHealthService.getIntegrationsStatus();
  res.json(list);
});

app.post('/api/integrations/:id/test', async (req, res) => {
  const result = await integrationHealthService.testIntegration(req.params.id);
  res.json(result);
});

// 7. Usage Summary
app.get('/api/usage/summary', (req, res) => {
  const usage = db.getUsage();
  res.json(usage);
});

// --- VITE MIDDLEWARE / STATIC FILES ---
async function setupServer() {
  if (!isProd) {
    // Mount Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FlowPilot AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
