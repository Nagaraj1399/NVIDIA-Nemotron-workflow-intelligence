import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  GitBranch, 
  FileText,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { ToolName, WorkflowTask } from '../types';

export const CreateWorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [objective, setObjective] = useState('');
  const [context, setContext] = useState('');
  const [referenceUrls, setReferenceUrls] = useState('');
  const [outputFormat, setOutputFormat] = useState('Comprehensive 10-Section Decision Report');
  const [constraints, setConstraints] = useState('Verify evidence citations against documented sources; evaluate mathematical formulas deterministically.');
  const [maxTasks, setMaxTasks] = useState(6);
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [selectedModel, setSelectedModel] = useState('nvidia/llama-3.1-nemotron-70b-instruct');

  // Plan generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planPreview, setPlanPreview] = useState<{
    title: string;
    summary: string;
    modelUsed: string;
    tasks: any[];
  } | null>(null);

  // If navigated from dashboard with state pre-filled
  useEffect(() => {
    if (location.state) {
      if (location.state.objective) setObjective(location.state.objective);
      if (location.state.approvalRequired !== undefined) setApprovalRequired(location.state.approvalRequired);
      if (location.state.generatedPlan) setPlanPreview(location.state.generatedPlan);
    }
  }, [location.state]);

  const templates = [
    {
      id: 'hackathon_benchmark',
      name: 'Market Research: AI Platforms (Hackathon Benchmark)',
      category: 'Market Research',
      objective: 'Research five AI workflow automation platforms suitable for small businesses. Compare documented features, integrations, pricing where available, strengths, limitations, and suitability. Recommend the three best options and produce an evidence-based decision report.',
      context: 'Nebius x NVIDIA AI Hackathon demonstration benchmark. Target audience is small business owners and technical leads.',
      outputFormat: 'Comprehensive 10-Section Decision Report',
      referenceUrls: 'https://make.com/en/pricing\nhttps://n8n.io/pricing\nhttps://zapier.com/central\nhttps://relay.app\nhttps://lindy.ai',
      constraints: 'Verify pricing against documented 2026 tiers; separate verified findings from assumptions.'
    },
    {
      id: 'vector_db',
      name: 'Engineering Research: Vector Databases',
      category: 'Engineering',
      objective: 'Benchmark open-source vector databases (Qdrant, Milvus, pgvector) for agentic memory retrieval. Compare indexing algorithms, memory footprints, query latencies, and total cost of ownership.',
      context: 'Infrastructure evaluation for high-concurrency LLM agents.',
      outputFormat: 'Technical Architecture & Sizing Deliverable',
      referenceUrls: 'https://qdrant.tech/documentation\nhttps://milvus.io/docs',
      constraints: 'Provide exact mathematical formulas for RAM consumption based on vector dimensions.'
    },
    {
      id: 'saas_pricing',
      name: 'Data Analysis: GPU Inference Cost Modeling',
      category: 'Data Analysis',
      objective: 'Extract and analyze token pricing models for cloud GPU inference providers (Nebius, AWS, Together AI). Model cost-per-million tokens across 8B, 70B, and 405B models.',
      context: 'Financial modeling for scaling autonomous agents.',
      outputFormat: 'Quantitative Cost Model & Comparative Spreadsheet',
      referenceUrls: 'https://nebius.com/pricing',
      constraints: 'Include both input and output token ratios assuming 1:2 prompt-to-completion balance.'
    },
    {
      id: 'compliance',
      name: 'Document Analysis: Data Governance & Privacy',
      category: 'Document Analysis',
      objective: 'Analyze data governance obligations for deploying AI workflow agents within healthcare and fintech contexts. Synthesize audit logging and retention controls.',
      context: 'SOC2 and HIPAA compliance verification.',
      outputFormat: 'Risk Assessment & Compliance Control Matrix',
      referenceUrls: '',
      constraints: 'Identify specific regulatory requirements for human oversight.'
    }
  ];

  const applyTemplate = (t: typeof templates[0]) => {
    setObjective(t.objective);
    setContext(t.context);
    setOutputFormat(t.outputFormat);
    setReferenceUrls(t.referenceUrls);
    setConstraints(t.constraints);
    setPlanPreview(null);
  };

  const handleGeneratePlan = async () => {
    if (!objective.trim()) return;
    setIsGenerating(true);
    setPlanError(null);

    const urls = referenceUrls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    try {
      const plan = await api.generatePlan({
        objective: objective.trim(),
        context: context.trim(),
        referenceUrls: urls,
        outputFormat,
        constraints,
        maxTasks: Number(maxTasks),
        model: selectedModel
      });
      setPlanPreview(plan);
    } catch (err: any) {
      setPlanError(err.message || 'Plan generation failed. Please refine objective.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAndRun = async () => {
    if (!planPreview || !planPreview.tasks) return;

    try {
      const urls = referenceUrls
        .split('\n')
        .map(u => u.trim())
        .filter(u => u.length > 0);

      const workflow = await api.createWorkflow({
        title: planPreview.title,
        objective: objective.trim(),
        context: context.trim(),
        referenceUrls: urls,
        outputFormat,
        constraints,
        approvalRequired,
        maxTasks: Number(maxTasks),
        modelUsed: planPreview.modelUsed || selectedModel,
        tasks: planPreview.tasks
      });

      // If approval required, navigate to execution studio where user can inspect and click "Approve"
      navigate(`/app/workflows/${workflow.id}`);
    } catch (err: any) {
      setPlanError(err.message || 'Failed to start workflow');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create New Workflow</h1>
        <p className="text-sm text-slate-400 mt-1">
          Define your objective. FlowPilot uses NVIDIA Nemotron to construct an observable DAG task plan before execution.
        </p>
      </div>

      {/* TEMPLATE PICKER */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
          Select a Template or Start From Scratch:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t)}
              className="p-3.5 rounded-xl text-left bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
                  {t.category}
                </span>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                  {t.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {t.objective}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-300 mt-3 flex items-center gap-1">
                Load Template →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* REQUEST EDITOR */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Workflow Specifications</span>
        </h2>

        {/* Objective */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Objective <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={3}
            value={objective}
            onChange={e => setObjective(e.target.value)}
            placeholder="e.g. Research five AI workflow automation platforms suitable for small businesses. Compare features, pricing, strengths, and recommend the top three..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
          />
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Context */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Target Audience / Context (Optional)
            </label>
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. Small business founders, technical leads, or compliance auditors"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Output Format */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Desired Output Format
            </label>
            <input
              type="text"
              value={outputFormat}
              onChange={e => setOutputFormat(e.target.value)}
              placeholder="e.g. Comprehensive 10-Section Decision Report"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Reference URLs */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Reference URLs (Optional, one per line)
            </label>
            <textarea
              rows={2}
              value={referenceUrls}
              onChange={e => setReferenceUrls(e.target.value)}
              placeholder="https://example.com/pricing&#10;https://example.com/docs"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none font-mono"
            />
          </div>

          {/* Execution Constraints */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Execution Constraints
            </label>
            <textarea
              rows={2}
              value={constraints}
              onChange={e => setConstraints(e.target.value)}
              placeholder="e.g. Require verifiable source URLs; flag any undocumented estimates"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>
        </div>

        {/* Planning Controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            {/* Model Selector */}
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-400">Model:</span>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="nvidia/llama-3.1-nemotron-70b-instruct">nvidia/llama-3.1-nemotron-70b (Nebius)</option>
                <option value="nvidia/nemotron-4-340b-instruct">nvidia/nemotron-4-340b (Nebius)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (Backup)</option>
              </select>
            </div>

            {/* Task Count Limit */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Max Tasks:</span>
              <input
                type="number"
                min={3}
                max={10}
                value={maxTasks}
                onChange={e => setMaxTasks(Math.min(10, Math.max(3, Number(e.target.value))))}
                className="w-14 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-center font-mono text-slate-200 focus:outline-none"
              />
            </div>

            {/* Human Approval Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={approvalRequired}
                onChange={e => setApprovalRequired(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Pause for human approval before execution</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isGenerating || !objective.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition active:scale-[0.98] shadow-md shadow-indigo-600/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating DAG Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {planError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{planError}</span>
        </div>
      )}

      {/* PLAN PREVIEW SECTION */}
      {planPreview && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                  Plan Preview
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Model: {planPreview.modelUsed}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{planPreview.title}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {planPreview.summary}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={handleApproveAndRun}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Launch Studio</span>
              </button>
            </div>
          </div>

          {/* Decomposed Task DAG Preview List */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Ordered DAG Task Decomposition ({planPreview.tasks.length} Nodes):
            </span>

            {planPreview.tasks.map((task: any, idx: number) => (
              <div 
                key={task.id || idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">{task.id}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      Tool: {task.tool}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>Dependencies:</span>
                    {task.dependencies && task.dependencies.length > 0 ? (
                      task.dependencies.map((dep: string) => (
                        <span key={dep} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                          {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-emerald-400">None (Root)</span>
                    )}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-200 mb-1">{task.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{task.description}</p>

                {task.verificationCriteria && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Criteria: {task.verificationCriteria}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              No tasks will execute until you approve the plan.
            </span>
            <button
              type="button"
              onClick={handleApproveAndRun}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition flex items-center gap-2 active:scale-[0.98]"
            >
              <span>Approve & Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
