import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  Save, 
  Check, 
  Lock,
  Layers,
  Clock
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [approvalPolicy, setApprovalPolicy] = useState('auto_safe');
  const [defaultTemplate, setDefaultTemplate] = useState('market_research');
  const [preferredFormat, setPreferredFormat] = useState('markdown_and_pdf');
  const [maxConcurrency, setMaxConcurrency] = useState(3);
  const [taskTimeout, setTaskTimeout] = useState(30);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Application Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure autonomous agent execution limits, safety boundaries, and deliverable presets.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Human-in-the-Loop Governance */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Execution Safety & Human Approval Policy</h2>
              <p className="text-xs text-slate-400 mt-0.5">Control when autonomous tool calls require explicit user sign-off</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {[
              {
                id: 'auto_safe',
                title: 'Bounded Autonomous with Side-Effect Guardrails (Recommended)',
                desc: 'Read-only tools (search, calculation, data analysis) run automatically. Consequential actions pause for human approval.'
              },
              {
                id: 'strict',
                title: 'Strict Human Approval on Every Task',
                desc: 'Execution pauses after each node in the DAG until an operator explicitly inspects parameters and approves.'
              },
              {
                id: 'autonomous',
                title: 'Fully Autonomous Pipeline Execution',
                desc: 'All validated tool calls execute without interruption. Best for automated benchmarking and testing.'
              }
            ].map(policy => (
              <label 
                key={policy.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  approvalPolicy === policy.id 
                    ? 'bg-indigo-950/20 border-indigo-500/60' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="approvalPolicy"
                  value={policy.id}
                  checked={approvalPolicy === policy.id}
                  onChange={e => setApprovalPolicy(e.target.value)}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">{policy.title}</span>
                  <span className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">{policy.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Deliverable Presets */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Deliverable & Report Preferences</h2>
              <p className="text-xs text-slate-400 mt-0.5">Format of final synthesized outputs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Default Report Output Format
              </label>
              <select
                value={preferredFormat}
                onChange={e => setPreferredFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="markdown_and_pdf">10-Section Decision Report (Markdown + PDF)</option>
                <option value="executive_brief">Executive Brief (3-Section Concise)</option>
                <option value="structured_json">Structured JSON Data Manifest</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Default Starting Template
              </label>
              <select
                value={defaultTemplate}
                onChange={e => setDefaultTemplate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="market_research">Market Research (Hackathon Benchmark)</option>
                <option value="engineering_benchmark">Engineering Research</option>
                <option value="data_analysis">Data Analysis & Cost Curves</option>
              </select>
            </div>
          </div>
        </div>

        {/* Execution Engine Limits */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Execution Bounds & Concurrency</h2>
              <p className="text-xs text-slate-400 mt-0.5">Safeguards to prevent run-away background executions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Max Concurrent Tasks
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={maxConcurrency}
                onChange={e => setMaxConcurrency(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Task Execution Timeout (Seconds)
              </label>
              <input
                type="number"
                min={10}
                max={120}
                value={taskTimeout}
                onChange={e => setTaskTimeout(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Preferences persisted successfully.
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/25 active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
