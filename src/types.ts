export type TaskStatus = 
  | 'pending'
  | 'ready'
  | 'running'
  | 'completed'
  | 'failed'
  | 'needs_approval'
  | 'cancelled'
  | 'skipped';

export type WorkflowStatus =
  | 'draft'
  | 'planning'
  | 'ready_for_approval'
  | 'approved'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'paused';

export type ToolName =
  | 'tavily_search'
  | 'csv_analyzer'
  | 'calculator'
  | 'document_generator'
  | 'verification_engine'
  | 'planner';

export interface VerificationResult {
  verified: boolean;
  score: number;
  criteria: string;
  notes: string;
  checkedAt: string;
}

export interface WorkflowTask {
  id: string;
  workflowId: string;
  title: string;
  description: string;
  tool: ToolName;
  dependencies: string[];
  status: TaskStatus;
  input: Record<string, any>;
  output?: any;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  requiresApproval?: boolean;
  verificationResult?: VerificationResult;
}

export interface WorkflowEvent {
  id: string;
  workflowId: string;
  taskId?: string;
  type: string;
  timestamp: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface FindingItem {
  claim: string;
  evidence: string;
  sourceUrl?: string;
  sourceTitle?: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface EvidenceSource {
  title: string;
  url: string;
  snippet: string;
  retrievalDate: string;
  reliability: 'verified' | 'primary' | 'secondary';
}

export interface WorkflowReport {
  id: string;
  workflowId: string;
  title: string;
  objective: string;
  executiveSummary: string;
  methodology: string;
  keyFindings: FindingItem[];
  evidenceSources: EvidenceSource[];
  analysis: string;
  recommendations: string[];
  verificationResults: {
    status: 'pass' | 'partial' | 'fail';
    score: number;
    checks: Array<{ name: string; passed: boolean; details: string }>;
  };
  limitations: string[];
  executionMetadata: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    durationMs: number;
    modelName: string;
    completedAt: string;
  };
  markdownContent: string;
  createdAt: string;
}

export interface Workflow {
  id: string;
  title: string;
  objective: string;
  context?: string;
  referenceUrls?: string[];
  outputFormat?: string;
  constraints?: string;
  status: WorkflowStatus;
  modelUsed: string;
  approvalRequired: boolean;
  maxTasks: number;
  tasks: WorkflowTask[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
  reportId?: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  description: string;
  category: 'inference' | 'search' | 'data' | 'computation' | 'export';
  status: 'connected' | 'not_configured' | 'degraded' | 'unavailable' | 'checking';
  lastChecked: string;
  lastLatencyMs?: number;
  error?: string;
  configDetails: {
    endpoint?: string;
    model?: string;
    hasKey: boolean;
    maskedKey?: string;
  };
}

export interface UsageSummary {
  totalInferenceRequests: number;
  totalTokensUsed: number;
  avgLatencyMs: number;
  totalToolsExecuted: number;
  successfulTasks: number;
  failedTasks: number;
  totalWorkflows: number;
  completedWorkflows: number;
  activeModel: string;
  recentRequests: Array<{
    id: string;
    timestamp: string;
    model: string;
    tokens: number;
    latencyMs: number;
    status: 'success' | 'failed';
    type: string;
  }>;
}

export interface ModelProviderInfo {
  provider: string;
  model: string;
  baseUrl: string;
  hasKey: boolean;
  maskedKey?: string;
  hasGeminiFallback: boolean;
}
