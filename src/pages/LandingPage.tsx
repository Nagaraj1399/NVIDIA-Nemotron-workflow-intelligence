import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  GitBranch, 
  Search, 
  FileCheck, 
  Play, 
  Layers, 
  Cpu, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Database,
  BarChart3,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 selection:bg-indigo-500/30">
      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070a11]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white">
                FlowPilot<span className="text-indigo-400 font-extrabold ml-0.5">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                Autonomous Workflow Intelligence
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#technology" className="hover:text-white transition">Technology</a>
            <Link to="/app/help" className="hover:text-white transition">Documentation</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/app/workflows/wf_demo_hackathon_nvidia"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Explore Benchmark</span>
            </Link>

            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/25 transition active:scale-[0.98]"
            >
              <span>Open Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-600/20 via-blue-600/15 to-purple-600/10 blur-[130px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Hackathon Track Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nebius × NVIDIA AI Hackathon 2026 — Best Apps & Agents Track</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Turn complex work into{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              intelligent workflows.
            </span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Describe your goal. FlowPilot plans the work into an observable DAG, coordinates real tools, verifies evidence, and delivers an authoritative report you can trust.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Launch FlowPilot Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/app/workflows/wf_demo_hackathon_nvidia"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Explore Benchmark Workflow</span>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>NVIDIA Nemotron Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Nebius Token Factory Inference</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero-Hallucination Evidence Links</span>
            </div>
          </div>
        </div>

        {/* REAL PRODUCT PREVIEW INTERFACE CARD */}
        <div className="max-w-6xl mx-auto mt-16 relative">
          <div className="rounded-2xl border border-slate-800 bg-[#0d131f]/95 p-3 shadow-2xl shadow-indigo-950/40 ring-1 ring-slate-800/80">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 rounded-t-xl text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-semibold text-slate-300">FlowPilot Execution Studio — Live Benchmark Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
                  5 / 5 Tasks Verified
                </span>
                <span className="text-indigo-400">nvidia/llama-3.1-nemotron-70b</span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0a0f19]">
              {/* DAG Pipeline Diagram */}
              <div className="lg:col-span-7 bg-[#0c121e] border border-slate-800/90 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-indigo-400" /> Verified Task Graph (DAG)
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Status: PASS (100% Verified)</span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'task_1', title: 'Discover 5 SMB Workflow Platforms', tool: 'tavily_search', status: 'Completed', score: '100%' },
                    { id: 'task_2', title: 'Extract Capabilities & Integrations Matrix', tool: 'tavily_search', status: 'Completed', score: '100%' },
                    { id: 'task_3', title: 'Calculate Monthly Volume Cost Curves', tool: 'calculator', status: 'Completed', score: '100%' },
                    { id: 'task_4', title: 'Multi-Factor Decision Rubric & Ranking', tool: 'verification_engine', status: 'Completed', score: '100%' },
                    { id: 'task_5', title: 'Generate 10-Section Decision Deliverable', tool: 'document_generator', status: 'Completed', score: '100%' },
                  ].map((task, idx) => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-500">{task.id}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-200">{task.title}</span>
                          <span className="text-[10px] font-mono text-indigo-400">{task.tool}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">{task.score}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Report Preview */}
              <div className="lg:col-span-5 bg-[#0c121e] border border-slate-800/90 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-blue-400" /> Evidence-Linked Report
                    </span>
                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded">
                      Deliverable Ready
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">
                    Strategic Assessment: AI Workflow Automation Platforms for SMBs
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                    For small businesses handling over 10,000 monthly operations, Make.com delivers a 6x lower cost-per-execution curve than legacy tools. Engineering teams requiring custom Python logic and Docker privacy benefit most from n8n Cloud.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Primary Sources:</span>
                      <span className="font-mono text-emerald-400">5 Verified URLs</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Mathematical Verification:</span>
                      <span className="font-mono text-indigo-400">Volume Curves Checked</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Hallucination Safeguard:</span>
                      <span className="font-mono text-emerald-400">Enforced by Engine</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => navigate('/app/reports/rep_demo_hackathon_nvidia')}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition"
                  >
                    <span>Inspect Full 10-Section Deliverable</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-STAGE WORKFLOW EXPLANATION */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-800/80 bg-[#090d16]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
              Autonomous Operational Loop
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
              Every workflow should be observable, useful, and verifiable.
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Unlike black-box agents that invent answers, FlowPilot decomposes work into observable steps with explicit human approval gates and empirical verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Describe',
                desc: 'Enter an objective in natural language with optional constraints, documents, and reference URLs.',
                icon: Bot,
                tag: 'Input Validation'
              },
              {
                step: '02',
                title: 'Plan',
                desc: 'NVIDIA Nemotron synthesizes a Directed Acyclic Graph (DAG) with dependencies, tool parameters, and criteria.',
                icon: GitBranch,
                tag: 'Topological DAG'
              },
              {
                step: '03',
                title: 'Execute',
                desc: 'The orchestrator drives approved tool calls: live search, data analysis, math calculations, and evidence storage.',
                icon: Play,
                tag: 'Controlled Tools'
              },
              {
                step: '04',
                title: 'Verify',
                desc: 'Every output is scored against verification criteria and synthesized into an evidence-linked final report.',
                icon: ShieldCheck,
                tag: 'Zero-Hallucination'
              }
            ].map(stage => {
              const Icon = stage.icon;
              return (
                <div 
                  key={stage.step}
                  className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition relative group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-bold text-slate-700 group-hover:text-indigo-500/60 transition">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {stage.tag}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{stage.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 px-6 border-t border-slate-800/80 bg-[#070a11]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Production Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
              Built for engineering and knowledge work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Structured AI Planning',
                desc: 'Generates typed, schema-validated task trees with cycle detection and explicit dependencies instead of chaotic LLM ramblings.',
                icon: Layers
              },
              {
                title: 'Observable Studio',
                desc: 'Inspect real-time task nodes, dependency curves, event logs, tool inputs, raw outputs, and execution duration.',
                icon: GitBranch
              },
              {
                title: 'Research & Data Tools',
                desc: 'Integrated with Tavily web search, safe arithmetic engines, CSV statistical profilers, and deliverable builders.',
                icon: Search
              },
              {
                title: 'Evidence-Linked Citations',
                desc: 'Claims link to original URLs and retrieved document snippets so decision-makers can audit every assertion.',
                icon: ShieldCheck
              },
              {
                title: 'Failure Recovery & Retries',
                desc: 'Configurable retry thresholds, isolated task replays, and partial failure reporting prevent all-or-nothing pipeline crashes.',
                icon: Terminal
              },
              {
                title: '10-Section Deliverables',
                desc: 'Compiles executive summaries, methodologies, findings, matrices, recommendations, and caveats into downloadable Markdown & PDF.',
                icon: FileCheck
              }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i} 
                  className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY & ARCHITECTURE SECTION */}
      <section id="technology" className="py-24 px-6 border-t border-slate-800/80 bg-[#090d16]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Under The Hood
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
              NVIDIA Nemotron on Nebius Token Factory
            </h2>
            <p className="mt-4 text-slate-400 text-sm">
              FlowPilot leverages NVIDIA’s open-source Nemotron models hosted on Nebius AI Cloud infrastructure to achieve low-latency structured planning and reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Cpu className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">NVIDIA Nemotron Architecture</h3>
                  <span className="text-xs font-mono text-emerald-400">nvidia/llama-3.1-nemotron-70b-instruct</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Nemotron serves as the primary reasoning agent. It performs topological task decomposition, input schema generation, tool routing, and verification synthesis.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strict JSON schema enforcement with cycle detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sub-400ms planning latency via Nebius Token Factory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transparent fallback to Gemini & offline engine</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Database className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Autonomous Tool Orchestrator</h3>
                  <span className="text-xs font-mono text-indigo-400">Application-Controlled Dispatcher</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                The model proposes actions, but the application runtime validates arguments, bounds execution timeouts, persists timestamped events, and enforces safety boundaries.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Zero arbitrary shell execution or SSRF risks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Human-in-the-loop approval gates before side-effects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Persistent JSON database surviving restarts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-6 border-t border-slate-800 bg-[#06080e] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">FlowPilot AI</span>
            <span className="text-slate-600">|</span>
            <span>Nebius × NVIDIA AI Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/app" className="hover:text-slate-200 transition">Workspace</Link>
            <Link to="/app/history" className="hover:text-slate-200 transition">History</Link>
            <Link to="/app/integrations" className="hover:text-slate-200 transition">Integrations</Link>
            <Link to="/app/help" className="hover:text-slate-200 transition">Documentation</Link>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Licensed under Apache-2.0 / MIT
          </div>
        </div>
      </footer>
    </div>
  );
};
