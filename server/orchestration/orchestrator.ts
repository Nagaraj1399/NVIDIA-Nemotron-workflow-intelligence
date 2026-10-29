/**
 * Workflow Orchestrator & Execution Engine for FlowPilot AI
 * Enforces DAG dependency resolution, state transitions, tool execution, and verification
 */

import { Workflow, WorkflowTask, WorkflowStatus } from '../types.js';
import { db } from '../db.js';
import { toolRegistry } from '../tools/toolRegistry.js';
import { reportGenerator } from '../services/reportGenerator.js';

export class WorkflowOrchestrator {
  private activeExecutions = new Set<string>();

  async executeWorkflow(workflowId: string): Promise<Workflow> {
    const workflow = db.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (this.activeExecutions.has(workflowId)) {
      return workflow;
    }

    workflow.status = 'running';
    workflow.updatedAt = new Date().toISOString();
    db.saveWorkflow(workflow);

    db.addEvent({
      workflowId,
      type: 'task_started',
      message: `Workflow execution started: "${workflow.title}"`
    });

    this.activeExecutions.add(workflowId);

    // Asynchronously drive execution
    this.driveExecutionLoop(workflowId).finally(() => {
      this.activeExecutions.delete(workflowId);
    });

    return workflow;
  }

  private async driveExecutionLoop(workflowId: string) {
    const startTime = Date.now();

    while (true) {
      const workflow = db.getWorkflow(workflowId);
      if (!workflow || workflow.status === 'cancelled' || workflow.status === 'paused') {
        break;
      }

      // Check if all tasks completed or failed
      const allDone = workflow.tasks.every(t => t.status === 'completed' || t.status === 'failed' || t.status === 'skipped');
      if (allDone) {
        const hasFailures = workflow.tasks.some(t => t.status === 'failed');
        workflow.status = hasFailures ? 'failed' : 'completed';
        workflow.completedAt = new Date().toISOString();
        workflow.durationMs = Date.now() - startTime;

        // Generate final report
        const report = reportGenerator.generateReport(workflow);
        workflow.reportId = report.id;
        db.saveWorkflow(workflow);

        db.addEvent({
          workflowId,
          type: hasFailures ? 'workflow_failed' : 'workflow_completed',
          message: hasFailures 
            ? 'Workflow completed with partial task failures. Report generated with limitations.'
            : 'Workflow completed successfully. All outputs verified and report generated.'
        });
        break;
      }

      // Check if any task is awaiting human approval
      const awaitingApproval = workflow.tasks.find(t => t.status === 'needs_approval');
      if (awaitingApproval) {
        workflow.status = 'ready_for_approval';
        db.saveWorkflow(workflow);
        break;
      }

      // Find tasks that are ready to run: status is 'pending', and all dependencies are 'completed'
      const completedTaskIds = new Set(
        workflow.tasks.filter(t => t.status === 'completed').map(t => t.id)
      );

      const nextTask = workflow.tasks.find(t => {
        if (t.status !== 'pending' && t.status !== 'ready') return false;
        // Check all dependencies
        return (t.dependencies || []).every(depId => completedTaskIds.has(depId));
      });

      if (!nextTask) {
        // If there are pending tasks but none can run due to failed dependencies, mark remaining as skipped
        const pendingTasks = workflow.tasks.filter(t => t.status === 'pending');
        if (pendingTasks.length > 0) {
          for (const pt of pendingTasks) {
            pt.status = 'skipped';
          }
          db.saveWorkflow(workflow);
        } else {
          break;
        }
        continue;
      }

      // Check if task needs approval
      if (nextTask.requiresApproval && nextTask.status !== 'ready') {
        nextTask.status = 'needs_approval';
        db.saveWorkflow(workflow);
        db.addEvent({
          workflowId,
          taskId: nextTask.id,
          type: 'approval_requested',
          message: `Human approval required before running task: "${nextTask.title}"`
        });
        break;
      }

      // Execute task
      await this.executeTask(workflowId, nextTask);
      // Small pause for realistic observability in live UI
      await new Promise(r => setTimeout(r, 600));
    }
  }

  private async executeTask(workflowId: string, task: WorkflowTask) {
    const workflow = db.getWorkflow(workflowId);
    if (!workflow) return;

    task.status = 'running';
    task.startedAt = new Date().toISOString();
    db.saveWorkflow(workflow);

    db.addEvent({
      workflowId,
      taskId: task.id,
      type: 'task_started',
      message: `Starting task: ${task.title}`
    });

    const tool = toolRegistry.getTool(task.tool);
    if (!tool) {
      task.status = 'failed';
      task.error = `Tool "${task.tool}" not found in registry`;
      db.saveWorkflow(workflow);
      db.addEvent({
        workflowId,
        taskId: task.id,
        type: 'task_failed',
        message: task.error
      });
      return;
    }

    db.addEvent({
      workflowId,
      taskId: task.id,
      type: 'tool_called',
      message: `Calling tool: ${task.tool}`,
      metadata: { input: task.input }
    });

    try {
      const output = await tool.execute(task.input, { workflow, task });
      task.output = output;

      db.addEvent({
        workflowId,
        taskId: task.id,
        type: 'tool_output',
        message: `Tool ${task.tool} completed execution`,
        metadata: { outputPreview: typeof output === 'object' ? Object.keys(output) : 'text' }
      });

      // Verify output
      const verification = await tool.verify(output);
      task.verificationResult = verification;

      db.addEvent({
        workflowId,
        taskId: task.id,
        type: 'verification_completed',
        message: `Task verification: ${verification.verified ? 'PASS' : 'FAIL'} (Score: ${verification.score}%)`,
        metadata: { verification }
      });

      if (verification.verified) {
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
        db.addEvent({
          workflowId,
          taskId: task.id,
          type: 'task_completed',
          message: `Task completed: ${task.title}`
        });
      } else {
        throw new Error(verification.notes || 'Task verification criteria not met');
      }
    } catch (err: any) {
      task.retryCount = (task.retryCount || 0) + 1;
      if (task.retryCount <= (task.maxRetries || 2)) {
        db.addEvent({
          workflowId,
          taskId: task.id,
          type: 'retry_attempted',
          message: `Task failed: ${err.message}. Retrying (${task.retryCount}/${task.maxRetries})...`
        });
        task.status = 'ready'; // Will retry in loop
      } else {
        task.status = 'failed';
        task.error = err.message;
        task.completedAt = new Date().toISOString();
        db.addEvent({
          workflowId,
          taskId: task.id,
          type: 'task_failed',
          message: `Task failed permanently after ${task.retryCount} attempts: ${err.message}`
        });
      }
    }

    db.saveWorkflow(workflow);
  }

  approveTask(workflowId: string, taskId: string): boolean {
    const workflow = db.getWorkflow(workflowId);
    if (!workflow) return false;

    const task = workflow.tasks.find(t => t.id === taskId);
    if (task && task.status === 'needs_approval') {
      task.status = 'ready';
      task.requiresApproval = false;
      workflow.status = 'running';
      db.saveWorkflow(workflow);

      db.addEvent({
        workflowId,
        taskId,
        type: 'approval_granted',
        message: `Approval granted by user for task: "${task.title}". Resuming execution.`
      });

      this.executeWorkflow(workflowId);
      return true;
    }
    return false;
  }

  cancelWorkflow(workflowId: string): boolean {
    const workflow = db.getWorkflow(workflowId);
    if (!workflow) return false;

    workflow.status = 'cancelled';
    for (const t of workflow.tasks) {
      if (t.status === 'pending' || t.status === 'running' || t.status === 'ready' || t.status === 'needs_approval') {
        t.status = 'cancelled';
      }
    }
    db.saveWorkflow(workflow);

    db.addEvent({
      workflowId,
      type: 'workflow_cancelled',
      message: 'Workflow execution cancelled by user.'
    });

    return true;
  }

  retryFailedTasks(workflowId: string): boolean {
    const workflow = db.getWorkflow(workflowId);
    if (!workflow) return false;

    for (const t of workflow.tasks) {
      if (t.status === 'failed' || t.status === 'skipped') {
        t.status = 'pending';
        t.retryCount = 0;
        t.error = undefined;
      }
    }
    workflow.status = 'running';
    db.saveWorkflow(workflow);

    db.addEvent({
      workflowId,
      type: 'retry_attempted',
      message: 'Retrying failed tasks in workflow.'
    });

    this.executeWorkflow(workflowId);
    return true;
  }
}

export const workflowOrchestrator = new WorkflowOrchestrator();
