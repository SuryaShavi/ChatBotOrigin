import React from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface CodeInputPanelProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  onAnalyze: () => void;
  disabled?: boolean;
}

export function CodeInputPanel({ 
  code, 
  setCode, 
  language, 
  setLanguage, 
  onAnalyze,
  disabled 
}: CodeInputPanelProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="relative bg-gradient-to-br from-slate-900/40 to-slate-950/60 rounded-3xl border border-cyan-500/20 shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-3xl blur-sm -z-10" />
        
        <div className="relative p-8 flex flex-col h-full">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl mb-2 text-cyan-100">Drop your code</h2>
            <p className="text-sm text-cyan-100/60">
              Paste a snippet and we'll guess if it's human-written or AI-generated.
            </p>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 to-slate-900/80 rounded-2xl border border-cyan-400/30 shadow-inner" />
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              className="relative w-full h-full min-h-[400px] bg-transparent text-cyan-50 p-6 rounded-2xl font-mono resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder:text-cyan-100/30 transition-all"
              spellCheck={false}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-end gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs text-cyan-100/60 mb-2 tracking-wide">
                LANGUAGE
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-slate-950/60 border-cyan-500/30 text-cyan-100 focus:ring-cyan-400/50 focus:border-cyan-400/50 rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-cyan-500/30 text-cyan-100">
                  <SelectItem value="auto">Auto Detect</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={onAnalyze}
              disabled={disabled || !code.trim()}
              className="relative px-8 h-11 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 hover:from-cyan-400 hover:via-purple-400 hover:to-fuchsia-400 text-white border-0 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
              <span className="relative flex items-center gap-2">
                Analyze Origin
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
          
          {/* Warning */}
          <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>This detector is experimental and can be wrong.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
