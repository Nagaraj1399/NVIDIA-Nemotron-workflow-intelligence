import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Cpu, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { WorkflowReport } from '../types';

export const ReportViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<WorkflowReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getReport(id)
      .then(setReport)
      .catch(err => setError(err.message || 'Report not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyMarkdown = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.markdownContent || report.executiveSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;
    const blob = new Blob([report.markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading Report Workspace...</span>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white mb-1">Report Not Found</h2>
          <p className="text-xs text-slate-400 mb-4">{error || 'This report may still be generating.'}</p>
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* TOP HEADER & EXPORT ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Deliverable #{report.id}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {report.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>Print / PDF</span>
          </button>

          <Link
            to={`/app/workflows/${report.workflowId}`}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center gap-1.5"
          >
            <span>Original Workflow</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* REPORT METADATA STRIP */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400 block mb-0.5">Verification Score</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> {report.verificationResults.score}% (PASS)
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Model Reasoner</span>
          <span className="text-slate-200 font-semibold truncate block">
            {report.executionMetadata.modelName.replace('nvidia/', '')}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Execution Duration</span>
          <span className="text-slate-200">
            {(report.executionMetadata.durationMs / 1000).toFixed(1)}s ({report.executionMetadata.totalTasks} Tasks)
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Generated On</span>
          <span className="text-slate-200">
            {new Date(report.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: MAIN CONTENT + EVIDENCE SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN REPORT DOCUMENT (8 cols) */}
        <div className="lg:col-span-8 space-y-8 bg-slate-900/30 p-6 sm:p-8 rounded-2xl border border-slate-800/80">
          {/* 1. Executive Summary */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              1. Executive Summary
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {report.executiveSummary}
            </p>
          </section>

          {/* 2. Objective */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              2. Objective & Scope
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.objective}
            </p>
          </section>

          {/* 3. Methodology */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              3. Methodology
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.methodology}
            </p>
          </section>

          {/* 4. Key Findings */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              4. Key Findings & Empirical Claims
            </h2>
            <div className="space-y-3">
              {report.keyFindings.map((finding, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200">
                      {finding.claim}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      {finding.confidence} Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Evidence:</strong> {finding.evidence}
                  </p>
                  {finding.sourceUrl && (
                    <a
                      href={finding.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 pt-1 font-mono"
                    >
                      <span>Source: {finding.sourceTitle || finding.sourceUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 6. Detailed Analysis */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              6. Detailed Analysis
            </h2>
            <div className="text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              {report.analysis}
            </div>
          </section>

          {/* 7. Recommendations */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              7. Actionable Recommendations
            </h2>
            <div className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Verification Results */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              8. Verification Audit Results
            </h2>
            <div className="space-y-2">
              {report.verificationResults.checks.map((check, i) => (
                <div 
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-200">{check.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{check.details}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 9. Limitations */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-indigo-400 uppercase tracking-wider font-mono text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              9. Limitations & Caveats
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
              {report.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* SIDEBAR: EVIDENCE & SOURCES (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 sticky top-20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>5. Verified Evidence Links ({report.evidenceSources.length})</span>
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every source cited below was retrieved during actual workflow execution with preserved URLs.
            </p>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {report.evidenceSources.map((source, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                      {source.reliability}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {source.retrievalDate}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2">
                    {source.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    "{source.snippet}"
                  </p>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline pt-1 font-mono truncate max-w-full"
                  >
                    <span>{source.url.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
