import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  XCircle, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  RefreshCw, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { api } from '../services/api';
import { Workflow, WorkflowTask, WorkflowEvent, TaskStatus } from '../types';
import { WorkflowGraph } from '../components/workflows/WorkflowGraph';

export const ExecutionStudioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [events, setEvents] = useState<WorkflowEvent[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'inspector' | 'timeline'>('inspector');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Polling ref
  const pollIntervalRef = useRef<any>(null);

  const fetchWorkflowData = async () => {
    if (!id) return;
    try {
      const [wf, evts] = await Promise.all([
        api.getWorkflow(id),
        api.getWorkflowEvents(id)
      ]);
      setWorkflow(wf);
      setEvents(evts);

      // Auto-select active or first task
      if (!selectedTaskId && wf.tasks && wf.tasks.length > 0) {
        const runningOrReady = wf.tasks.find(t => t.status === 'running' || t.status === 'needs_approval') || wf.tasks[0];
        setSelectedTaskId(runningOrReady.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load workflow execution');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowData();

    // Start polling every 1.2 seconds if running
    pollIntervalRef.current = setInterval(() => {
      api.getWorkflow(id!).then(wf => {
        setWorkflow(wf);
        if (wf.status !== 'running' && wf.status !== 'ready_for_approval') {
          // If execution stopped, refresh events once and slow down
          api.getWorkflowEvents(id!).then(setEvents);
        } else {
          api.getWorkflowEvents(id!).then(setEvents);
        }
      }).catch(console.error);
    }, 1200);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [id]);

  const handleApproveWorkflow = async () => {
    if (!id) return;
    setIsActionLoading(true);
    try {
      await api.approveWorkflow(id);
      await fetchWorkflowData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApproveTask = async (taskId: string) => {
    if (!id) return;
    setIsActionLoading(true);
    try {
      await api.approveTask(id, taskId);
      await fetchWorkflowData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelWorkflow = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to cancel execution?')) return;
    setIsActionLoading(true);
    try {
      await api.cancelWorkflow(id);
      await fetchWorkflowData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRetryFailed = async () => {
    if (!id) return;
    setIsActionLoading(true);
    try {
      await api.retryWorkflow(id);
      await fetchWorkflowData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !workflow) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading Execution Studio...</span>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white mb-1">Workflow Unavailable</h2>
          <p className="text-xs text-slate-400 mb-4">{error || 'Workflow not found.'}</p>
          <Link
            to="/app"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 inline-block"
          >
            Back to Workspace
          </Link>
        </div>
      </div>
    );
  }

  const selectedTask = workflow.tasks.find(t => t.id === selectedTaskId);
  const completedTasksCount = workflow.tasks.filter(t => t.status === 'completed').length;
  const totalTasksCount = workflow.tasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const awaitingApprovalTask = workflow.tasks.find(t => t.status === 'needs_approval');

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running Execution
          </span>
        );
      case 'ready_for_approval':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Awaiting Human Approval
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Execution Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-slate-400 bg-slate-800 border border-slate-700">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-slate-400 bg-slate-800 border border-slate-700 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#070b13]">
      {/* STUDIO HEADER */}
      <div className="p-4 sm:px-6 border-b border-slate-800/90 bg-[#0c121e] shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Metadata */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-slate-400 font-semibold">{workflow.id}</span>
              {getStatusPill(workflow.status)}
              <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>{workflow.modelUsed}</span>
              </div>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {workflow.title}
            </h2>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* If ready for initial plan approval */}
            {workflow.status === 'ready_for_approval' && (
              <button
                onClick={handleApproveWorkflow}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Plan & Run</span>
              </button>
            )}

            {/* If a task requires approval */}
            {awaitingApprovalTask && (
              <button
                onClick={() => handleApproveTask(awaitingApprovalTask.id)}
                disabled={isActionLoading}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/20 flex items-center gap-2 animate-pulse transition"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Approve Task: {awaitingApprovalTask.id}</span>
              </button>
            )}

            {/* If failed, allow retry */}
            {workflow.status === 'failed' && (
              <button
                onClick={handleRetryFailed}
                disabled={isActionLoading}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Retry Failed</span>
              </button>
            )}

            {/* If running, allow cancel */}
            {workflow.status === 'running' && (
              <button
                onClick={handleCancelWorkflow}
                disabled={isActionLoading}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            {/* If completed, show report button */}
            {workflow.status === 'completed' && workflow.reportId && (
              <button
                onClick={() => navigate(`/app/reports/${workflow.reportId}`)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 flex items-center gap-2 transition"
              >
                <FileText className="w-4 h-4" />
                <span>View Generated Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Objective Line */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <p className="line-clamp-1 italic max-w-2xl">
            "{workflow.objective}"
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span>Tasks: <strong className="text-slate-200">{completedTasksCount} / {totalTasksCount}</strong></span>
            <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${workflow.status === 'completed' ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-semibold text-slate-300">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* HUMAN APPROVAL BANNER IF BLOCKED */}
      {awaitingApprovalTask && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Action Paused:</strong> Task <code>{awaitingApprovalTask.id}</code> ({awaitingApprovalTask.title}) requires human approval before proceeding.
            </span>
          </div>
          <button
            onClick={() => handleApproveTask(awaitingApprovalTask.id)}
            className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
          >
            Grant Approval
          </button>
        </div>
      )}

      {/* 3-PANEL WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* LEFT PANEL: Task Tree & Outline (260px) */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-[#0a0f19] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Task Sequence
            </span>
            <span className="text-[10px] font-mono text-slate-500">{workflow.tasks.length} tasks</span>
          </div>

          <div className="p-2 space-y-1.5">
            {workflow.tasks.map(task => {
              const isSelected = selectedTaskId === task.id;
              const isCompleted = task.status === 'completed';
              const isRunning = task.status === 'running';
              const isFailed = task.status === 'failed';

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`
                    p-2.5 rounded-lg border text-left cursor-pointer transition select-none
                    ${isSelected 
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm' 
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400">{task.id}</span>
                    <span className={`text-[10px] font-mono font-medium ${
                      isCompleted ? 'text-emerald-400' : (isRunning ? 'text-blue-400 animate-pulse' : (isFailed ? 'text-rose-400' : 'text-slate-400'))
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                    {task.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-indigo-400">{task.tool}</span>
                    {task.verificationResult && (
                      <span className="text-emerald-400 font-mono font-semibold">
                        {task.verificationResult.score}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER PANEL: Visual Interactive DAG Graph */}
        <div className="flex-1 min-h-[350px] lg:min-h-0 bg-[#080c15] p-3 flex flex-col overflow-hidden">
          <WorkflowGraph
            tasks={workflow.tasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={id => setSelectedTaskId(id)}
          />
        </div>

        {/* RIGHT PANEL: Output Inspector & Live Event Timeline (380px) */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-[#0a0f19] flex flex-col shrink-0 overflow-hidden">
          {/* Right Panel Tabs */}
          <div className="h-11 border-b border-slate-800/80 bg-slate-950/60 flex items-center px-3 gap-2 shrink-0">
            <button
              onClick={() => setActiveRightTab('inspector')}
              className={`
                px-3 py-1.5 text-xs font-semibold rounded-md transition
                ${activeRightTab === 'inspector' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              Task Inspector
            </button>
            <button
              onClick={() => setActiveRightTab('timeline')}
              className={`
                px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5
                ${activeRightTab === 'timeline' 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <span>Timeline</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-400">
                {events.length}
              </span>
            </button>
          </div>

          {/* TAB 1: Selected Task Inspector */}
          {activeRightTab === 'inspector' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedTask ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-400">{selectedTask.id}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {selectedTask.tool}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {selectedTask.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {selectedTask.description}
                    </p>
                  </div>

                  {/* Dependencies */}
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Dependencies:
                    </span>
                    {selectedTask.dependencies && selectedTask.dependencies.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTask.dependencies.map(d => (
                          <button
                            key={d}
                            onClick={() => setSelectedTaskId(d)}
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-700 text-[11px] font-mono"
                          >
                            {d} →
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Root node (None)</span>
                    )}
                  </div>

                  {/* Verification Results */}
                  {selectedTask.verificationResult && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Verification Passed</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-400">
                          {selectedTask.verificationResult.score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {selectedTask.verificationResult.notes}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-emerald-500/20">
                        Criteria: {selectedTask.verificationResult.criteria}
                      </div>
                    </div>
                  )}

                  {/* Error Box if Failed */}
                  {selectedTask.error && (
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-rose-400">
                        <AlertCircle className="w-4 h-4" /> Task Failed:
                      </span>
                      <p className="text-[11px] font-mono leading-relaxed">{selectedTask.error}</p>
                    </div>
                  )}

                  {/* Tool Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Tool Input Parameters
                      </span>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(selectedTask.input, null, 2))}
                        className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40">
                      {JSON.stringify(selectedTask.input, null, 2)}
                    </pre>
                  </div>

                  {/* Tool Output Data */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Observed Tool Output
                      </span>
                      {selectedTask.output && (
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(selectedTask.output, null, 2))}
                          className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy</span>
                        </button>
                      )}
                    </div>
                    {selectedTask.output ? (
                      <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto max-h-56">
                        {JSON.stringify(selectedTask.output, null, 2)}
                      </pre>
                    ) : (
                      <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/80 text-center text-xs text-slate-500 font-mono">
                        Awaiting execution output...
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500">
                  Select a node from the task graph to inspect details.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Live Execution Timeline */}
          {activeRightTab === 'timeline' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                Real-Time Execution Events ({events.length})
              </span>

              {events.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  No execution events recorded yet.
                </div>
              ) : (
                <div className="relative pl-4 border-l border-slate-800 space-y-3">
                  {events.slice().reverse().map(evt => (
                    <div key={evt.id} className="relative group text-xs">
                      {/* Event Dot */}
                      <span className={`
                        absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0a0f19]
                        ${evt.type.includes('fail') ? 'bg-rose-400' : (evt.type.includes('complete') ? 'bg-emerald-400' : 'bg-indigo-500')}
                      `} />
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                        <span className="text-indigo-400 font-semibold uppercase">{evt.type.replace(/_/g, ' ')}</span>
                        <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {evt.message}
                      </p>
                      {evt.taskId && (
                        <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          Task: {evt.taskId}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
