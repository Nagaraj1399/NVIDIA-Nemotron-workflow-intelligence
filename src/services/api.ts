import {
  Workflow,
  WorkflowEvent,
  WorkflowReport,
  IntegrationStatus,
  UsageSummary,
  ModelProviderInfo
} from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getModelStatus(): Promise<ModelProviderInfo> {
    const res = await fetch('/api/models/status');
    return res.json();
  },

  async testModel(): Promise<{ success: boolean; latencyMs: number; message: string; model: string }> {
    const res = await fetch('/api/models/test', { method: 'POST' });
    return res.json();
  },

  async generatePlan(payload: {
    objective: string;
    context?: string;
    referenceUrls?: string[];
    outputFormat?: string;
    constraints?: string;
    maxTasks?: number;
    model?: string;
    planningMode?: 'fast' | 'detailed';
  }) {
    const res = await fetch('/api/workflows/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Plan generation failed' }));
      throw new Error(err.error || 'Failed to generate plan');
    }
    return res.json();
  },

  async getWorkflows(): Promise<Workflow[]> {
    const res = await fetch('/api/workflows');
    return res.json();
  },

  async getWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(`/api/workflows/${id}`);
    if (!res.ok) throw new Error('Workflow not found');
    return res.json();
  },

  async createWorkflow(payload: Partial<Workflow>): Promise<Workflow> {
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create workflow' }));
      throw new Error(err.error || 'Failed to create workflow');
    }
    return res.json();
  },

  async deleteWorkflow(id: string): Promise<boolean> {
    const res = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async approveWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(`/api/workflows/${id}/approve`, { method: 'POST' });
    return res.json();
  },

  async approveTask(workflowId: string, taskId: string): Promise<Workflow> {
    const res = await fetch(`/api/workflows/${workflowId}/task/${taskId}/approve`, { method: 'POST' });
    return res.json();
  },

  async cancelWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(`/api/workflows/${id}/cancel`, { method: 'POST' });
    return res.json();
  },

  async retryWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(`/api/workflows/${id}/retry`, { method: 'POST' });
    return res.json();
  },

  async getWorkflowEvents(id: string): Promise<WorkflowEvent[]> {
    const res = await fetch(`/api/workflows/${id}/events`);
    return res.json();
  },

  async getWorkflowReport(id: string): Promise<WorkflowReport> {
    const res = await fetch(`/api/workflows/${id}/report`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },

  async getReports(): Promise<WorkflowReport[]> {
    const res = await fetch('/api/reports');
    return res.json();
  },

  async getReport(id: string): Promise<WorkflowReport> {
    const res = await fetch(`/api/reports/${id}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },

  async getIntegrations(): Promise<IntegrationStatus[]> {
    const res = await fetch('/api/integrations');
    return res.json();
  },

  async testIntegration(id: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    const res = await fetch(`/api/integrations/${id}/test`, { method: 'POST' });
    return res.json();
  },

  async getUsageSummary(): Promise<UsageSummary> {
    const res = await fetch('/api/usage/summary');
    return res.json();
  }
};
