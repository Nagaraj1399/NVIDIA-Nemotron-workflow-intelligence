import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Trash2, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Clock, 
  XCircle,
  Plus,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { Workflow, WorkflowStatus } from '../types';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkflows();
      setWorkflows(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this workflow and all associated events?')) return;

    setIsDeleting(id);
    try {
      await api.deleteWorkflow(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      alert('Failed to delete workflow');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredWorkflows = workflows
    .filter(wf => {
      const matchSearch = 
        wf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wf.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wf.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || wf.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });

  const getStatusBadge = (status: WorkflowStatus) => {
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
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" /> Cancelled
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Workflow History</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Search and audit past executions, deliverables, and verification evidence.
          </p>
        </div>

        <Link
          to="/app/workflows/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Workflow</span>
        </Link>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, goal, or ID..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* WORKFLOW TABLE / LIST */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <span className="text-xs font-mono text-slate-400">Loading stored workflows...</span>
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No Workflows Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'No executions match your current filter criteria.' 
              : 'Launch your first autonomous workflow or explore the benchmark demo.'}
          </p>
          <Link
            to="/app/workflows/new"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 inline-block"
          >
            Create Workflow
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWorkflows.map(wf => {
            const completedCount = wf.tasks.filter(t => t.status === 'completed').length;
            const totalCount = wf.tasks.length;
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={wf.id}
                onClick={() => navigate(`/app/workflows/${wf.id}`)}
                className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-slate-400">{wf.id}</span>
                    {getStatusBadge(wf.status)}
                    <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {wf.modelUsed.replace('nvidia/', '')}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white truncate">
                    {wf.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {wf.objective}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400 font-mono">
                    <span>Progress: {completedCount}/{totalCount} tasks ({pct}%)</span>
                    <span>•</span>
                    <span>Created: {new Date(wf.createdAt).toLocaleDateString()}</span>
                    {wf.completedAt && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">
                          Duration: {wf.durationMs ? `${(wf.durationMs / 1000).toFixed(1)}s` : 'Done'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:border-l sm:border-slate-800 sm:pl-4 shrink-0">
                  {wf.reportId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/reports/${wf.reportId}`);
                      }}
                      className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                      title="Open Report"
                    >
                      <FileText className="w-4 h-4 text-blue-400" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleDelete(wf.id, e)}
                    disabled={isDeleting === wf.id}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
