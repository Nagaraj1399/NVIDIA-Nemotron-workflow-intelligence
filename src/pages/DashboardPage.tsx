import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Layers, 
  Cpu, 
  Zap, 
  Play, 
  Search, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Activity,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../services/api';
import { Workflow, WorkflowReport, IntegrationStatus, UsageSummary } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  // Data states
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [reports, setReports] = useState<WorkflowReport[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Preference options
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [planningMode, setPlanningMode] = useState<'detailed' | 'fast'>('detailed');

  const loadData = async () => {
    try {
      setLoading(true);
      const [wfList, repList, intList, usageData] = await Promise.all([
        api.getWorkflows(),
        api.getReports(),
        api.getIntegrations(),
        api.getUsageSummary()
      ]);
      setWorkflows(wfList);
      setReports(repList);
      setIntegrations(intList);
      setUsage(usageData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreatePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsPlanning(true);
    setPlanError(null);

    try {
      const plan = await api.generatePlan({
        objective: prompt.trim(),
        planningMode,
        maxTasks: 6
      });

      // Navigate to /app/workflows/new with initial plan pre-filled via state
      navigate('/app/workflows/new', { 
        state: { 
          objective: prompt.trim(), 
          generatedPlan: plan,
          approvalRequired
        } 
      });
    } catch (err: any) {
      setPlanError(err.message || 'Plan generation failed');
      setIsPlanning(false);
    }
  };

  // Metrics derived from actual stored workflow records
  const totalWorkflows = workflows.length;
  const completedWorkflows = workflows.filter(w => w.status === 'completed').length;
  const attentionNeeded = workflows.filter(w => w.status === 'failed' || w.status === 'ready_for_approval').length;
  const totalTasksCompleted = workflows.reduce((acc, w) => {
    return acc + (w.tasks ? w.tasks.filter(t => t.status === 'completed').length : 0);
  }, 0);

  const examplePrompts = [
    {
      title: 'NVIDIA Hackathon Benchmark',
      text: 'Research five AI workflow automation platforms suitable for small businesses. Compare documented features, integrations, pricing where available, strengths, limitations, and suitability. Recommend the three best options and produce an evidence-based decision report.'
    },
    {
      title: 'Vector Database Benchmarking',
      text: 'Analyze the operational trade-offs between Qdrant, Milvus, and pgvector for AI agent memory. Model hosting costs and query latency.'
    },
    {
      title: 'Multi-Tier SaaS Pricing Analysis',
      text: 'Extract and analyze pricing models for cloud GPU inference providers. Calculate unit economics per 1M tokens.'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> Running
          </span>
        );
      case 'ready_for_approval':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Needs Approval
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Your Workspace</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Plan, execute, and review your AI workflows with observable evidence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/app/history"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
          >
            View History
          </Link>
          <Link
            to="/app/workflows/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Workflow</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Workflows',
            value: totalWorkflows,
            icon: Layers,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20'
          },
          {
            label: 'Completed Workflows',
            value: completedWorkflows,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
          },
          {
            label: 'Requiring Attention',
            value: attentionNeeded,
            icon: AlertCircle,
            color: attentionNeeded > 0 ? 'text-amber-400' : 'text-slate-400',
            bg: attentionNeeded > 0 ? 'bg-amber-500/10' : 'bg-slate-800/60',
            border: attentionNeeded > 0 ? 'border-amber-500/20' : 'border-slate-700/40'
          },
          {
            label: 'Tasks Completed',
            value: totalTasksCompleted,
            icon: ShieldCheck,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
          }
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-medium text-slate-400">{metric.label}</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {loading ? '—' : metric.value}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${metric.bg} border ${metric.border}`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION A: WORKFLOW COMPOSER */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f1626] to-[#0a0f1a] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-base font-bold text-white">Autonomous Workflow Composer</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>NVIDIA Nemotron (Nebius Token Factory)</span>
          </div>
        </div>

        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="What would you like FlowPilot to accomplish? Describe the objective, target outputs, or constraints..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none leading-relaxed"
            />
          </div>

          {planError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{planError}</span>
            </div>
          )}

          {/* Example prompt pills */}
          <div>
            <span className="text-[11px] font-mono text-slate-400 font-medium uppercase tracking-wider block mb-2">
              Quick Benchmark Scenarios:
            </span>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(ex.text)}
                  className="text-xs text-left px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition flex items-center gap-1.5 group"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300 shrink-0" />
                  <span className="font-semibold text-slate-200">{ex.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Composer Footer & Options */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={approvalRequired}
                  onChange={e => setApprovalRequired(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Require human approval before execution</span>
              </label>

              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={planningMode}
                  onChange={e => setPlanningMode(e.target.value as any)}
                  className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="detailed" className="bg-slate-900 text-slate-200">Detailed Planning</option>
                  <option value="fast" className="bg-slate-900 text-slate-200">Fast Planning</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPlanning || !prompt.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition active:scale-[0.98]"
            >
              {isPlanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Task Graph...</span>
                </>
              ) : (
                <>
                  <span>Generate Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION B & C: RECENT WORKFLOWS & RECENT REPORTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Workflows */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Workflows</h3>
            <Link to="/app/history" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All ({workflows.length})
            </Link>
          </div>

          {workflows.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No workflows executed yet.</p>
              <button
                onClick={() => setPrompt(examplePrompts[0].text)}
                className="mt-3 text-xs text-indigo-400 hover:underline"
              >
                Load Hackathon Benchmark
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.slice(0, 5).map(wf => {
                const completedCount = wf.tasks.filter(t => t.status === 'completed').length;
                const totalCount = wf.tasks.length;
                const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <div
                    key={wf.id}
                    onClick={() => navigate(`/app/workflows/${wf.id}`)}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{wf.id}</span>
                        {getStatusBadge(wf.status)}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                        {wf.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span>Tasks: {completedCount} / {totalCount}</span>
                        <span>•</span>
                        <span>{new Date(wf.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-mono text-indigo-400 truncate max-w-[120px]">
                          {wf.modelUsed.replace('nvidia/', '')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:border-l sm:border-slate-800 sm:pl-4 shrink-0">
                      <div className="w-20 text-right">
                        <span className="text-xs font-mono font-bold text-slate-300">{pct}%</span>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${wf.status === 'completed' ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Recent Reports</h3>
              <span className="text-xs font-mono text-slate-400">{reports.length} generated</span>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Reports appear once workflows complete.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 4).map(rep => (
                  <div
                    key={rep.id}
                    onClick={() => navigate(`/app/reports/${rep.id}`)}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        Score: {rep.verificationResults.score}%
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                      {rep.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {rep.executiveSummary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Download format: Markdown & PDF</span>
            <Link to="/app/reports/rep_demo_hackathon_nvidia" className="text-indigo-400 hover:underline">
              Inspect Benchmark Report →
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION D: SYSTEM HEALTH (Independently Verified) */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">System Integrations & Verification Health</h3>
          </div>
          <Link to="/app/integrations" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            Manage Integrations →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map(integ => {
            const isConnected = integ.status === 'connected';
            const isConfigured = integ.status !== 'not_configured';

            return (
              <div 
                key={integ.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-200">{integ.name.split(' ')[0]}</span>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {integ.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className={isConnected ? 'text-emerald-400' : 'text-amber-400'}>
                    {integ.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400">
                    {integ.lastLatencyMs ? `${integ.lastLatencyMs}ms` : 'Local'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
