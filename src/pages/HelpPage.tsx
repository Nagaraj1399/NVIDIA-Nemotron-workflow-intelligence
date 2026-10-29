import React from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Cpu, 
  GitBranch, 
  ShieldCheck, 
  Terminal, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Zap,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HelpPage: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Documentation & Architecture Guide</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">FlowPilot AI Guide</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Everything you need to plan, orchestrate, verify, and deploy autonomous workflows powered by NVIDIA Nemotron on Nebius Token Factory.
        </p>
      </div>

      {/* QUICK BENCHMARK WALKTHROUGH */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-blue-950/20 to-slate-900 border border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
              <Play className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nebius × NVIDIA Hackathon 3-Minute Demo Walkthrough</h2>
              <span className="text-xs text-indigo-300 font-mono">Best Apps & Agents Track Benchmark</span>
            </div>
          </div>
          <Link
            to="/app/workflows/wf_demo_hackathon_nvidia"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/25 transition"
          >
            Launch Benchmark Studio →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">1. Plan Generation (0:00 - 0:40)</strong>
            Natural-language request decomposed into a 5-node DAG by NVIDIA Nemotron with schema validation.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">2. Observable Execution (0:40 - 1:40)</strong>
            Live task transitions, web research citations via Tavily, and cost modeling calculations.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">3. Verified Report (1:40 - 2:40)</strong>
            Full 10-section deliverable with verified URLs, zero hallucinations, and Markdown/PDF export.
          </div>
        </div>
      </div>

      {/* ARCHITECTURE DIAGRAM EXPLANATION */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          <span>System Execution Pipeline</span>
        </h2>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-emerald-400/90 whitespace-pre">
{`[User Objective] 
      │
      ▼
[Input Validation & Constraint Guard]
      │
      ▼
[NVIDIA Nemotron Reasoner (Nebius Token Factory)]
      │
      ▼
[DAG Schema Parser & Cycle Detector]
      │
      ├──> [Plan Preview & Human Review Gate]
      │
      ▼ (Approved)
[Workflow Orchestrator (State Machine)]
      │
      ├──> Task 1: Web Research & Evidence Extraction (Tavily Tool)
      ├──> Task 2: Quantitative Cost-Curve Calculations (Safe Math Tool)
      ├──> Task 3: Tabular Distribution Profiling (CSV Tool)
      ├──> Task 4: Empirical Output Verification (Verification Engine)
      │
      ▼
[10-Section Deliverable & Report Generator]
      │
      ▼
[Persistent Storage (Survives Restarts) & Markdown/PDF Export]`}
          </div>

          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            Unlike fragile black-box agents that hallucinate entire outputs in a single prompt, FlowPilot enforces a stateful Directed Acyclic Graph (DAG). Every intermediate tool call is isolated, monitored, and verified against measurable criteria before downstream tasks begin.
          </p>
        </div>
      </div>

      {/* ENVIRONMENT VARIABLES & SETUP */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <span>Configuration & Credentials</span>
        </h2>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Configure the following environment variables in your <code>.env</code> file:
          </p>

          <div className="space-y-3 font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">NEBIUS_API_KEY</span>
              <span className="text-slate-400 block mb-1">Required for real live calls to Nebius Token Factory.</span>
              <code className="text-indigo-300 text-[11px]">NEBIUS_API_KEY="your_nebius_api_key_here"</code>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">NEBIUS_BASE_URL</span>
              <span className="text-slate-400 block mb-1">Default OpenAI-compatible endpoint for Nebius Token Factory.</span>
              <code className="text-indigo-300 text-[11px]">NEBIUS_BASE_URL="https://api.studio.nebius.ai/v1"</code>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">NEBIUS_MODEL</span>
              <span className="text-slate-400 block mb-1">Active NVIDIA Nemotron model identifier.</span>
              <code className="text-indigo-300 text-[11px]">NEBIUS_MODEL="nvidia/llama-3.1-nemotron-70b-instruct"</code>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-blue-400 font-bold block mb-1">TAVILY_API_KEY (Optional)</span>
              <span className="text-slate-400 block mb-1">Enables live internet search. If omitted, autonomous verified knowledge base is used.</span>
              <code className="text-indigo-300 text-[11px]">TAVILY_API_KEY="tvly-..."</code>
            </div>
          </div>
        </div>
      </div>

      {/* TROUBLESHOOTING */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Troubleshooting & FAQ</span>
        </h2>

        <div className="space-y-3 text-xs">
          {[
            {
              q: 'What happens if NEBIUS_API_KEY is not configured yet?',
              a: 'FlowPilot will fall back transparently to GEMINI_API_KEY if configured in Google AI Studio secrets, or engage the local offline autonomous engine. The UI clearly labels which provider is running so you are never deceived.'
            },
            {
              q: 'How does human-in-the-loop approval work?',
              a: 'If a workflow or task is configured with requiresApproval: true, the orchestrator state machine pauses in the ready_for_approval or needs_approval state. Execution will only resume when an operator clicks "Grant Approval" in the Studio.'
            },
            {
              q: 'Where are reports and workflows saved?',
              a: 'All workflows, tasks, timestamped execution events, and 10-section decision reports are persisted into server JSON databases in ./data/. They survive server restarts and browser refreshes.'
            }
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1.5">
              <h3 className="font-bold text-slate-200">{faq.q}</h3>
              <p className="text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
