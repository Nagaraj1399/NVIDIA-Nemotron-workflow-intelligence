/**
 * Workflow Planner & DAG Validator for FlowPilot AI
 * Uses NVIDIA Nemotron / Nebius Token Factory with topological cycle detection
 */

import { WorkflowTask, ToolName } from '../types.js';
import { nebiusClient } from '../models/nebiusClient.js';
import { toolRegistry } from '../tools/toolRegistry.js';

export interface PlanGenerationRequest {
  objective: string;
  context?: string;
  referenceUrls?: string[];
  outputFormat?: string;
  constraints?: string;
  maxTasks?: number;
  model?: string;
  planningMode?: 'fast' | 'detailed';
}

export interface GeneratedPlan {
  title: string;
  summary: string;
  modelUsed: string;
  tasks: Array<Omit<WorkflowTask, 'workflowId' | 'status' | 'retryCount' | 'maxRetries'>>;
}

export class WorkflowPlanner {
  async generatePlan(req: PlanGenerationRequest): Promise<GeneratedPlan> {
    const maxTasks = req.maxTasks || 6;
    const availableTools = toolRegistry.getAllTools().map(t => `${t.name}: ${t.description}`).join('\n');

    const systemPrompt = `You are FlowPilot AI's Lead Autonomous Workflow Planner.
You construct Directed Acyclic Graph (DAG) execution plans for complex tasks.
Return ONLY a valid JSON object with this exact structure:
{
  "title": "Clear concise workflow title",
  "summary": "Brief executive summary of how this plan achieves the goal",
  "tasks": [
    {
      "id": "task_1",
      "title": "Action-oriented task title",
      "description": "Specific, observable instructions",
      "tool": "tavily_search" | "csv_analyzer" | "calculator" | "verification_engine" | "document_generator",
      "dependencies": [],
      "input": {},
      "verificationCriteria": "Measurable validation criteria that must be satisfied"
    }
  ]
}

Available tools:
${availableTools}

Rules:
1. First tasks must have dependencies: [].
2. Subsequent tasks must reference valid earlier task IDs (e.g. ["task_1"]).
3. Never create cyclical dependencies.
4. Total tasks must NOT exceed ${maxTasks}.
5. End with document_generator or verification_engine to produce the verified deliverable.
6. The output must be pure JSON with no markdown wrapping or conversational text.`;

    const userPrompt = `Objective: ${req.objective}
Context: ${req.context || 'General workflow'}
Reference URLs: ${(req.referenceUrls || []).join(', ') || 'None provided'}
Constraints: ${req.constraints || 'Standard quality constraints'}
Target Output: ${req.outputFormat || '10-section decision report'}`;

    const result = await nebiusClient.generateChatCompletion(systemPrompt, userPrompt);
    
    // Clean and parse JSON
    const plan = this.parseAndValidatePlan(result.content, maxTasks);
    return {
      ...plan,
      modelUsed: result.model
    };
  }

  private parseAndValidatePlan(rawText: string, maxTasks: number): Omit<GeneratedPlan, 'modelUsed'> {
    let cleanJson = rawText.trim();
    // Strip markdown code fences if present
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (err) {
      // Attempt to extract JSON block using regex
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (innerErr) {
          throw new Error('Failed to parse model plan output as valid JSON.');
        }
      } else {
        throw new Error('No valid JSON plan structure returned by model.');
      }
    }

    if (!parsed.tasks || !Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
      throw new Error('Plan contains no executable tasks.');
    }

    // Limit to max tasks
    parsed.tasks = parsed.tasks.slice(0, maxTasks);

    // Validate DAG structure: Unique IDs, tool existence, dependency validity, cycle detection
    const taskIds = new Set<string>();
    for (const task of parsed.tasks) {
      if (!task.id) {
        task.id = 'task_' + (taskIds.size + 1);
      }
      taskIds.add(task.id);

      // Validate tool
      const validTools: ToolName[] = ['tavily_search', 'csv_analyzer', 'calculator', 'verification_engine', 'document_generator'];
      if (!validTools.includes(task.tool)) {
        task.tool = 'verification_engine'; // Safe fallback
      }
    }

    // Validate dependencies and check for cycles
    for (const task of parsed.tasks) {
      task.dependencies = (task.dependencies || []).filter((depId: string) => 
        taskIds.has(depId) && depId !== task.id
      );
    }

    if (this.detectCycle(parsed.tasks)) {
      throw new Error('Cyclic dependency detected in task plan graph. Plan rejected.');
    }

    return {
      title: parsed.title || 'Autonomous Workflow Plan',
      summary: parsed.summary || 'Decomposed task execution plan with verified dependencies.',
      tasks: parsed.tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        tool: t.tool as ToolName,
        dependencies: t.dependencies || [],
        input: t.input || {},
        requiresApproval: t.requiresApproval || false,
        verificationResult: undefined
      }))
    };
  }

  // Directed Acyclic Graph (DAG) cycle detector via DFS
  private detectCycle(tasks: any[]): boolean {
    const adj = new Map<string, string[]>();
    for (const t of tasks) {
      adj.set(t.id, t.dependencies || []);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (node: string): boolean => {
      visited.add(node);
      recStack.add(node);

      const neighbors = adj.get(node) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          if (hasCycle(n)) return true;
        } else if (recStack.has(n)) {
          return true; // Cycle detected
        }
      }

      recStack.delete(node);
      return false;
    };

    for (const t of tasks) {
      if (!visited.has(t.id)) {
        if (hasCycle(t.id)) return true;
      }
    }

    return false;
  }
}

export const workflowPlanner = new WorkflowPlanner();
