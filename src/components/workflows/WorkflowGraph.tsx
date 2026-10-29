import React, { useState } from 'react';
import { 
  WorkflowTask, 
  TaskStatus, 
  ToolName 
} from '../../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  PlayCircle, 
  Search, 
  Calculator, 
  FileText, 
  ShieldCheck, 
  Table, 
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';

interface WorkflowGraphProps {
  tasks: WorkflowTask[];
  selectedTaskId?: string;
  onSelectTask: (taskId: string) => void;
}

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const getToolIcon = (tool: ToolName) => {
    switch (tool) {
      case 'tavily_search':
        return <Search className="w-4 h-4 text-emerald-400" />;
      case 'calculator':
        return <Calculator className="w-4 h-4 text-amber-400" />;
      case 'csv_analyzer':
        return <Table className="w-4 h-4 text-purple-400" />;
      case 'verification_engine':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'document_generator':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> Running
          </span>
        );
      case 'ready':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            <PlayCircle className="w-3 h-3" /> Ready
          </span>
        );
      case 'needs_approval':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">
            <ShieldAlert className="w-3 h-3" /> Approval Needed
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
      case 'skipped':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
            Skipped
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  // Compute node coordinates based on dependencies (rank levels)
  const computeLayout = () => {
    const levels: Map<string, number> = new Map();
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    const getLevel = (taskId: string, visited: Set<string>): number => {
      if (visited.has(taskId)) return 0;
      visited.add(taskId);
      const t = taskMap.get(taskId);
      if (!t || !t.dependencies || t.dependencies.length === 0) return 0;
      let maxDep = 0;
      for (const dep of t.dependencies) {
        maxDep = Math.max(maxDep, getLevel(dep, new Set(visited)) + 1);
      }
      return maxDep;
    };

    tasks.forEach(t => {
      levels.set(t.id, getLevel(t.id, new Set()));
    });

    // Group tasks by level
    const levelGroups: Map<number, WorkflowTask[]> = new Map();
    tasks.forEach(t => {
      const lvl = levels.get(t.id) || 0;
      if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
      levelGroups.get(lvl)!.push(t);
    });

    const positions: Map<string, { x: number; y: number; width: number; height: number }> = new Map();
    const nodeWidth = 240;
    const nodeHeight = 110;
    const levelSpacing = 300;
    const rowSpacing = 140;

    levelGroups.forEach((group, lvl) => {
      const totalGroupHeight = (group.length - 1) * rowSpacing;
      const startY = Math.max(40, 200 - totalGroupHeight / 2);

      group.forEach((task, idx) => {
        positions.set(task.id, {
          x: 40 + lvl * levelSpacing,
          y: startY + idx * rowSpacing,
          width: nodeWidth,
          height: nodeHeight
        });
      });
    });

    return positions;
  };

  const positions = computeLayout();

  // Find canvas dimensions
  let maxX = 700;
  let maxY = 450;
  positions.forEach(p => {
    if (p.x + p.width + 80 > maxX) maxX = p.x + p.width + 80;
    if (p.y + p.height + 80 > maxY) maxY = p.y + p.height + 80;
  });

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#0d131f] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col">
      {/* Graph Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-lg shadow-lg">
        <button
          onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          title="Zoom Out"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          title="Zoom In"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition text-xs"
          title="Reset View"
        >
          Fit
        </button>
      </div>

      {/* Graph Watermark / DAG Title */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
          Observable Directed Acyclic Graph (DAG)
        </span>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full h-full overflow-auto bg-grid-pattern relative p-4">
        <div 
          style={{ 
            width: `${maxX}px`, 
            height: `${maxY}px`,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
            transition: 'transform 0.15s ease-out'
          }}
          className="relative"
        >
          {/* SVG Dependency Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker
                id="arrowhead-completed"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
              </marker>
              <marker
                id="arrowhead-pending"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
            </defs>

            {tasks.map(task => {
              const targetPos = positions.get(task.id);
              if (!targetPos || !task.dependencies) return null;

              return task.dependencies.map(depId => {
                const sourcePos = positions.get(depId);
                if (!sourcePos) return null;

                const startX = sourcePos.x + sourcePos.width;
                const startY = sourcePos.y + sourcePos.height / 2;
                const endX = targetPos.x;
                const endY = targetPos.y + targetPos.height / 2;

                const deltaX = (endX - startX) / 2;
                const pathData = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

                const isCompleted = task.status === 'completed';
                const isRunning = task.status === 'running';

                return (
                  <path
                    key={`${depId}->${task.id}`}
                    d={pathData}
                    fill="none"
                    stroke={isCompleted ? '#10b981' : (isRunning ? '#6366f1' : '#334155')}
                    strokeWidth={isRunning ? 2.5 : 1.75}
                    strokeDasharray={task.status === 'pending' ? '4 3' : undefined}
                    markerEnd={isCompleted ? 'url(#arrowhead-completed)' : (isRunning ? 'url(#arrowhead-active)' : 'url(#arrowhead-pending)')}
                    className="transition-all duration-300"
                  />
                );
              });
            })}
          </svg>

          {/* Interactive HTML Task Nodes */}
          {tasks.map(task => {
            const pos = positions.get(task.id);
            if (!pos) return null;

            const isSelected = selectedTaskId === task.id;
            const isRunning = task.status === 'running';
            const isCompleted = task.status === 'completed';
            const isFailed = task.status === 'failed';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${pos.width}px`,
                  minHeight: `${pos.height}px`
                }}
                className={`
                  z-10 group cursor-pointer rounded-xl p-3.5 transition-all duration-200 select-none
                  border text-left shadow-lg
                  ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-400 bg-slate-900/95 shadow-indigo-500/10' : 'hover:border-slate-600 bg-slate-900/80'}
                  ${isRunning ? 'border-blue-500/80 bg-blue-950/20 shadow-blue-500/20 glow-blue' : ''}
                  ${isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : ''}
                  ${isFailed ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800'}
                `}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      {getToolIcon(task.tool)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-medium">
                      {task.id}
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(task.status)}
                  </div>
                </div>

                {/* Node Title */}
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1 group-hover:text-white transition">
                  {task.title}
                </h4>

                {/* Node Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>

                {/* Verification Score Indicator if verified */}
                {task.verificationResult && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Score:
                    </span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {task.verificationResult.score}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
