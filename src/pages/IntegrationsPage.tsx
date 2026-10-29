import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Cpu, 
  Search, 
  Calculator, 
  Table, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  Lock, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { IntegrationStatus } from '../types';

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; latencyMs: number; message: string }>>({});

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await api.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const res = await api.testIntegration(id);
      setTestResults(prev => ({ ...prev, [id]: res }));
      // Reload list to update latencies
      const updated = await api.getIntegrations();
      setIntegrations(updated);
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [id]: { success: false, latencyMs: 0, message: err.message || 'Connection test failed' }
      }));
    } finally {
      setTestingId(null);
    }
  };

  const getIntegrationIcon = (category: string) => {
    switch (category) {
      case 'inference':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'search':
        return <Search className="w-5 h-5 text-blue-400" />;
      case 'computation':
        return <Calculator className="w-5 h-5 text-amber-400" />;
      case 'data':
        return <Table className="w-5 h-5 text-purple-400" />;
      case 'export':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      default:
        return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Active
          </span>
        );
      case 'not_configured':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" /> Key Not Configured
          </span>
        );
      case 'degraded':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" /> Degraded
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tool & Provider Integrations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage AI model backends, search APIs, and bounded computation tools.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Server-Side Credentials Enforced</span>
        </div>
      </div>

      {/* SECURITY NOTICE */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-white">Enterprise Credential Security</span>
          <p className="text-slate-400 leading-relaxed">
            API keys (<code>NEBIUS_API_KEY</code>, <code>TAVILY_API_KEY</code>) are managed exclusively on the application backend via environment variables. Keys are never transmitted to client bundles or saved in localStorage.
          </p>
        </div>
      </div>

      {/* INTEGRATIONS LIST */}
      <div className="space-y-4">
        {integrations.map(integ => {
          const isTesting = testingId === integ.id;
          const testResult = testResults[integ.id];

          return (
            <div
              key={integ.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 shrink-0">
                    {getIntegrationIcon(integ.category)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{integ.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-2xl">
                      {integ.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getStatusBadge(integ.status)}
                  <button
                    onClick={() => handleTest(integ.id)}
                    disabled={isTesting}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-50 transition flex items-center gap-1.5"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Test Connection</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Configuration Details Strip */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-400">
                {integ.configDetails.endpoint && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Endpoint</span>
                    <span className="text-slate-300 truncate block">{integ.configDetails.endpoint}</span>
                  </div>
                )}
                {integ.configDetails.model && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Active Model</span>
                    <span className="text-emerald-400 truncate block">{integ.configDetails.model}</span>
                  </div>
                )}
                {integ.configDetails.hasKey !== undefined && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">API Key</span>
                    <span className="text-slate-300">
                      {integ.configDetails.maskedKey || (integ.configDetails.hasKey ? 'Configured (Masked)' : 'Not Set in Env')}
                    </span>
                  </div>
                )}
              </div>

              {/* Live Test Result Banner */}
              {testResult && (
                <div className={`p-3 rounded-xl text-xs flex items-center justify-between gap-3 ${
                  testResult.success 
                    ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-950/30 border border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.latencyMs > 0 && (
                    <span className="font-mono text-[11px] shrink-0">
                      Latency: {testResult.latencyMs}ms
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
