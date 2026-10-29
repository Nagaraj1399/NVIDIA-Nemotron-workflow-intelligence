import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Plus, 
  LayoutDashboard, 
  History, 
  FileText, 
  Cpu, 
  Layers, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Activity,
  Sparkles,
  Play
} from 'lucide-react';
import { api } from '../../services/api';
import { ModelProviderInfo } from '../../types';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelProviderInfo | null>(null);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'checking' | 'degraded'>('healthy');

  useEffect(() => {
    api.getModelStatus()
      .then(info => setModelInfo(info))
      .catch(() => setHealthStatus('degraded'));

    api.getHealth()
      .then(() => setHealthStatus('healthy'))
      .catch(() => setHealthStatus('degraded'));
  }, []);

  const navItems = [
    { label: 'Overview', path: '/app', icon: LayoutDashboard },
    { label: 'Workflow History', path: '/app/history', icon: History },
    { label: 'Reports', path: '/app/reports', icon: FileText },
    { label: 'Integrations', path: '/app/integrations', icon: Layers },
    { label: 'Model Usage', path: '/app/settings/models', icon: Cpu },
    { label: 'Settings', path: '/app/settings', icon: Settings },
    { label: 'Help & Docs', path: '/app/help', icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100">
      {/* LEFT SIDEBAR */}
      <aside 
        className={`
          flex flex-col border-r border-slate-800/80 bg-[#0c111d] transition-all duration-300 z-30 select-none
          ${collapsed ? 'w-[72px]' : 'w-[252px]'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  FlowPilot<span className="text-indigo-400 font-extrabold ml-0.5">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  Autonomous Engine
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-lg transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="p-3">
          <Link
            to="/app/workflows/new"
            className={`
              flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all shadow-md
              bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.98]
              ${collapsed ? 'p-2' : ''}
            `}
            title="Create New Workflow"
          >
            <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
            {!collapsed && <span>New Workflow</span>}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active 
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }
                  ${collapsed ? 'justify-center px-0' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Model Status & Footer Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Model Core
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="text-xs font-mono font-medium text-slate-200 truncate" title={modelInfo?.model || 'nvidia/llama-3.1-nemotron-70b'}>
                  {modelInfo?.model ? modelInfo.model.replace('nvidia/', '') : 'nemotron-70b'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Nebius Token Factory
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                <span>Hackathon 2026</span>
                <span className="text-indigo-400 font-mono text-[10px]">v1.0.0</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div 
                className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" 
                title="Model inference ready"
              />
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP TOOLBAR */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0c111d]/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
          {/* Breadcrumbs & Route Identifier */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-slate-400 tracking-wider uppercase">
              Workspace
            </span>
            <span className="text-slate-600">/</span>
            <h1 className="text-sm font-semibold text-slate-200 capitalize">
              {location.pathname === '/app' 
                ? 'Overview Dashboard' 
                : location.pathname.split('/')[2]?.replace('-', ' ') || 'Execution'}
            </h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Workflow Launcher */}
            <button
              onClick={() => navigate('/app/workflows/wf_demo_hackathon_nvidia')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
              title="Inspect Default Benchmark Workflow"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Benchmark Demo</span>
            </button>

            {/* Public Landing Link */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 transition"
            >
              <span>Landing</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Health Status Indicator */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-300 hidden sm:inline">Nebius API</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE VIEWPORT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#090d16]">
          {children}
        </main>
      </div>
    </div>
  );
};
