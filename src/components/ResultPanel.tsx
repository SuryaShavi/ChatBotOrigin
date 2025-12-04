import React from 'react';
import { Badge } from './ui/badge';
import { Loader2, Sparkles, User } from 'lucide-react';

interface ResultData {
  type: 'ai' | 'human';
  confidence: number;
  reasons: string[];
  model?: 'Heuristic' | 'OpenAI' | 'Heuristic + OpenAI'; // 👈 NEW
}

interface ResultPanelProps {
  state: 'empty' | 'loading' | 'result';
  resultData: ResultData | null;
}

export function ResultPanel({ state, resultData }: ResultPanelProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="relative bg-gradient-to-br from-slate-900/40 to-slate-950/60 rounded-3xl border border-purple-500/20 shadow-2xl backdrop-blur-sm overflow-hidden h-full">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-pink-500/20 rounded-3xl blur-sm -z-10" />

        <div className="relative p-8 h-full flex flex-col items-center justify-center">
          {state === 'empty' && <EmptyState />}
          {state === 'loading' && <LoadingState />}
          {state === 'result' && resultData && <ResultState data={resultData} />}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center max-w-md">
      {/* Holographic circle */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-pulse" />
        <div
          className="absolute inset-4 rounded-full border-2 border-purple-500/20 animate-pulse"
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className="absolute inset-8 rounded-full border-2 border-fuchsia-500/20 animate-pulse"
          style={{ animationDelay: '0.4s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 blur-xl" />
        </div>
      </div>

      <h3 className="text-xl mb-3 text-cyan-100">Awaiting code sample…</h3>
      <p className="text-sm text-cyan-100/60">
        Paste some code on the left and click Analyze Origin.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center max-w-md">
      {/* Animated loader */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-24 h-24 text-cyan-400 animate-spin" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 blur-2xl animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl mb-3 text-cyan-100">Scanning code patterns…</h3>
      <p className="text-sm text-cyan-100/60">
        Analyzing structure, style, and complexity
      </p>
    </div>
  );
}

function ResultState({ data }: { data: ResultData }) {
  const isAI = data.type === 'ai';
  const modelLabel = data.model ?? 'Heuristic'; // 👈 default if backend doesn’t send it

  return (
    <div className="w-full max-w-lg">
      {/* Badge + model label */}
      <div className="flex flex-col items-center mb-8 gap-3">
        <Badge
          variant="outline"
          className={`px-6 py-3 text-base rounded-full border-2 ${
            isAI
              ? 'border-fuchsia-400/50 text-fuchsia-300 bg-fuchsia-500/10'
              : 'border-cyan-400/50 text-cyan-300 bg-cyan-500/10'
          } flex items-center gap-2 shadow-lg`}
        >
          {isAI ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
          {isAI ? 'AI-Generated' : 'Human-Written'}
        </Badge>

        <span className="text-[11px] px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 tracking-wide opacity-80 font-mono">
          Model: {modelLabel}
        </span>
      </div>

      {/* Confidence */}
      <div className="bg-slate-950/50 border border-cyan-500/20 rounded-2xl p-8 mb-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            {data.confidence}%
          </div>
          <p className="text-sm text-cyan-100/60">Confidence Level</p>
        </div>

        <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-cyan-500/50 transition-all"
            style={{ width: `${data.confidence}%` }}
          />
        </div>
      </div>

      {/* Reasons */}
      <div className="bg-slate-950/50 border border-purple-500/20 rounded-2xl p-8">
        <h4 className="text-base mb-4 text-purple-300">Why we think this:</h4>
        <ul className="space-y-3">
          {data.reasons.map((reason, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-cyan-100/70"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 mt-2 flex-shrink-0" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
