import React, { useState } from 'react';

type ResultType = 'ai' | 'human';

interface ResultData {
  type: ResultType;
  confidence: number;
  reasons: string[];
  model?: 'Heuristic' | 'OpenAI' | 'Heuristic + OpenAI';
}

type ViewState = 'empty' | 'loading' | 'result' | 'error';

interface HistoryItem {
  id: number;
  timestamp: string;
  language: string;
  codePreview: string;
  status: 'success' | 'error';
  result?: ResultData;
  errorMessage?: string;
}

type InfoSection = 'about' | 'api' | 'docs' | null;

// use Vite env; fallback to localhost for dev
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000';

  // set minimum code length for analysis
const MIN_CODE_LENGTH = 20;

      const SAMPLE_JS_CODE = `function sum(a, b) {
        return a + b;
      }

      const numbers = [1, 2, 3, 4];
      const total = numbers.reduce((acc, n) => acc + n, 0);

      console.log(total);`;

      const SAMPLE_PY_CODE = `def sum_numbers(numbers):
          total = 0
          for n in numbers:
              total += n
          return total

      nums = [1, 2, 3, 4]
      print(sum_numbers(nums))`;


const App: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');
  const [state, setState] = useState<ViewState>('empty');
  const [result, setResult] = useState<ResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openSection, setOpenSection] = useState<InfoSection>(null);
  const [showPasteHint, setShowPasteHint] = useState(false);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string | null>(null);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [analysisDuration, setAnalysisDuration] = useState<number | null>(null);



  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp' | 'codePreview'>) => {
    const now = new Date();
    const codePreview =
      code
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80) + (code.length > 80 ? '…' : '');

    setHistory((prev) =>
      [
        {
          id: prev.length + 1,
          timestamp: now.toLocaleTimeString(),
          codePreview: codePreview || '(empty)',
          ...item,
        },
        ...prev,
      ].slice(0, 10)
    );
  };

  

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    const startTime = performance.now();
  
    setState('loading');
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) {
        let backendMessage = '';
        try {
          const errJson = await res.json();
          backendMessage = errJson.error || '';
        } catch {
          // ignore parse error
        }
        throw new Error(backendMessage || `Server error (status ${res.status})`);
      }

      // backend returns { type, confidence, reasons, model? }
      const dataRaw = (await res.json()) as Partial<ResultData>;
      // ensure model is present so UI shows "Model: ..." always
      const normalized: ResultData = {
        type: dataRaw.type === 'ai' ? 'ai' : 'human',
        confidence:
          typeof dataRaw.confidence === 'number'
            ? Math.max(0, Math.min(100, Math.round(dataRaw.confidence)))
            : 55,
        reasons: Array.isArray(dataRaw.reasons)
          ? dataRaw.reasons
          : ['No reasons provided by backend.'],
        model: dataRaw.model ?? 'Heuristic',
      };

      const endTime = performance.now();
      setAnalysisDuration(Number(((endTime - startTime) / 1000).toFixed(2)));

      setResult(normalized);
      setState('result');
      setAnimatedConfidence(0);
      setTimeout(() => {
        setAnimatedConfidence(normalized.confidence);
      }, 100);

      setLastAnalyzedAt(new Date().toLocaleString());
      addToHistory({ language, status: 'success', result: normalized });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach the server. Please try again.';

      setErrorMessage(message);
      setResult(null);
      setState('error');
      addToHistory({ language, status: 'error', errorMessage: message });
    }
  };
  const handleReset = () => {
  setCode('');
  setResult(null);
  setErrorMessage(null);
  setState('empty');
};

const handleClearText = () => {
  setCode('');
};

const handleCopyResult = async () => {
  if (!result) return;

  const text = `
Verdict: ${result.type === 'ai' ? 'AI-Generated' : 'Human-Written'}
Confidence: ${result.confidence}%
Reasons:
${result.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}
  `.trim();

  await navigator.clipboard.writeText(text);
  alert('Result copied to clipboard');
};


const insertSampleCode = (lang: 'javascript' | 'python') => {
  if (lang === 'javascript') {
    setCode(SAMPLE_JS_CODE);
    setLanguage('javascript');
  } else {
    setCode(SAMPLE_PY_CODE);
    setLanguage('python');
  }
};


  const isLoading = state === 'loading';
   const getConfidenceLabel = (confidence: number) => {
      if (confidence >= 80) return { label: 'High', color: 'text-green-400' };
      if (confidence >= 60) return { label: 'Medium', color: 'text-yellow-400' };
      return { label: 'Low', color: 'text-red-400' };
      };

  const isCodeValid = code.trim().length >= MIN_CODE_LENGTH;

  
  const renderInfoContent = () => {
    if (!openSection) return null;

    if (openSection === 'about') {
      return (
        <>
          <h2 className="text-lg font-semibold mb-2 text-cyan-200">About CodeOrigin</h2>
          <p className="text-sm text-slate-200/80 mb-3">
            CodeOrigin is an experimental tool that estimates whether a code snippet
            was written by a human or generated by an AI model.
          </p>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
            <li>
              Uses heuristic rules plus an optional OpenAI-based classifier to refine
              the verdict.
            </li>
            <li>Shows a confidence score and short explanations for the decision.</li>
            <li>
              Designed as a demo — results can be wrong and should not be used for
              grading, policing, or high-stakes decisions.
            </li>
          </ul>
        </>
      );
    }

    if (openSection === 'api') {
      return (
        <>
          <h2 className="text-lg font-semibold mb-2 text-purple-200">API</h2>
          <p className="text-sm text-slate-200/80 mb-3">
            The backend exposes a single HTTP endpoint for analysis.
          </p>

          <div className="mb-3">
            <p className="text-xs text-slate-300 font-semibold mb-1">Endpoint</p>
            <pre className="text-[11px] bg-black/60 border border-slate-700 rounded-md p-2 font-mono text-slate-100 overflow-x-auto">

{"{ code: string, language: 'auto' | 'javascript' | 'python' | 'java' | 'cpp' }"}
            </pre>
          </div>

          <div className="mb-3">
            <p className="text-xs text-slate-300 font-semibold mb-1">Response fields</p>
            <pre className="text-[11px] bg-black/60 border border-slate-700 rounded-md p-2 font-mono text-slate-100 overflow-x-auto">
{"{ type: 'ai' | 'human', confidence: number (0-100), reasons: string[], model?: 'Heuristic' | 'Heuristic + OpenAI' }"}
            </pre>
          </div>

          <div>
            <p className="text-xs text-slate-300 font-semibold mb-1">Example response</p>
            <pre className="text-[11px] bg-black/60 border border-slate-700 rounded-md p-2 font-mono text-slate-100 overflow-x-auto">
{"{ \"type\": \"ai\", \"confidence\": 82, \"reasons\": [\"Few comments\", \"Highly regular formatting\"], \"model\": \"Heuristic + OpenAI\" }"}
            </pre>
          </div>
        </>
      );
    }

    // docs
    return (
      <>
        <h2 className="text-lg font-semibold mb-2 text-pink-200">Docs</h2>
        <ol className="list-decimal list-inside text-sm text-slate-200/85 space-y-1 mb-3">
          <li>Paste or type your source code into the left panel.</li>
          <li>
            Select the language (or keep <span className="font-semibold">Auto</span>).
          </li>
          <li>
            Click <span className="font-semibold">Analyze Origin</span>.
          </li>
          <li>
            Watch the right panel for the AI vs Human verdict, confidence, and model
            label.
          </li>
        </ol>
        <p className="text-xs text-slate-400">
          The detector uses heuristic rules combined with optional AI classification.
          Treat results as hints, not proof.
        </p>
      </>
    );
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-[#020617] via-[#020016] to-black text-white">
      {/* HEADER */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur border-b border-cyan-500/10 relative z-20">
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          CodeOrigin
        </div>

        <nav className="flex gap-4 text-xs tracking-[0.18em] uppercase">
          <button
            className="opacity-70 hover:opacity-100 hover:text-cyan-300 transition"
            onClick={() => setOpenSection('about')}
          >
            About
          </button>
          <button
            className="opacity-70 hover:opacity-100 hover:text-purple-300 transition"
            onClick={() => setOpenSection('api')}
          >
            API
          </button>
          <button
            className="opacity-70 hover:opacity-100 hover:text-pink-300 transition"
            onClick={() => setOpenSection('docs')}
          >
            Docs
          </button>
        </nav>
      </header>

      {/* INFO MODAL */}
      {openSection && (
        <div className="fixed inset-0 z-30 flex items-start justify-center pt-20 bg-black/70">
          <div className="w-full max-w-2xl bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 relative shadow-2xl">
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 text-sm"
              onClick={() => setOpenSection(null)}
            >
              ✕
            </button>
            {renderInfoContent()}
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main
      className={`min-h-[calc(100vh-64px)] px-8 py-6 grid gap-6 relative overflow-hidden ${
      state === 'empty' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
       }`    }
       >
        {/* subtle background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="w-full h-full bg-[radial-gradient(circle_at_top,_#22d3ee_0,_transparent_40%),radial-gradient(circle_at_bottom,_#a855f7_0,_transparent_40%)]" />
        </div>

        {/* LEFT – CODE INPUT */}
        <section className="relative z-10 bg-black/40 border border-cyan-500/25 rounded-2xl p-5 flex flex-col shadow-[0_0_40px_rgba(34,211,238,0.2)] overflow-hidden">
          <div className="absolute -top-24 -left-16 w-56 h-56 bg-cyan-500/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-32 -right-10 w-64 h-64 bg-purple-500/30 blur-3xl rounded-full" />

          <div className="relative">
            <h2 className="text-xl font-semibold">Drop your code</h2>
            <p className="text-xs opacity-70 mt-1">
              Paste a snippet and we’ll guess if it’s human-written or AI-generated.
            </p>
          </div>

          <textarea
            className="relative mt-4 flex-1 bg-gradient-to-br from-[#020617]/90 to-black/90 rounded-xl p-4 border border-cyan-400/40 focus:border-cyan-300 focus:outline-none font-mono text-xs placeholder:text-cyan-400/40 resize-none"
            placeholder="// Paste your code here..."
            value={code}
            onChange={(e) => {
                                setCode(e.target.value);
                              }}
                              onPaste={() => {
                                setShowPasteHint(true);
                                setTimeout(() => setShowPasteHint(false), 3000);
                              }}

            spellCheck={false}
          />

          <p className="mt-2 text-[11px] text-right">
          <span
            className={
              code.length < MIN_CODE_LENGTH
                ? 'text-red-400'
                : 'text-green-400'
            }
          >
            {code.length} characters
          </span>

          {code.length < MIN_CODE_LENGTH && (
            <span className="ml-2 text-red-400">
              (minimum {MIN_CODE_LENGTH} required)
            </span>
          )}
          </p>

              {showPasteHint && (
              <p className="text-[11px] text-cyan-400 mt-1">
                📋 Code pasted
              </p>
               )}

            <div className="flex gap-2 mb-3">
            <button
              onClick={() => insertSampleCode('javascript')}
              className="px-3 py-1 rounded-full text-[11px] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition"
            >
              Sample JS
            </button>

            <button
              onClick={() => insertSampleCode('python')}
              className="px-3 py-1 rounded-full text-[11px] border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition"
            >
              Sample Python
            </button>
            </div>


          <div className="relative mt-4 flex items-center justify-between gap-3">
            <select
              className="bg-black/60 text-xs rounded-full px-3 py-2 border border-purple-500/40 outline-none tracking-wide"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <div className="flex gap-2">
              
              <button
                onClick={handleClearText}
                className="px-4 py-2 rounded-full border border-cyan-500/40 text-xs text-cyan-300 hover:bg-cyan-500/10 transition"
              >
                Clear Text
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-full border border-slate-500 text-xs text-slate-300 hover:bg-slate-800 transition"
              >
                Reset
              </button>

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !isCodeValid}
                title={!isCodeValid ? `Enter at least ${MIN_CODE_LENGTH} characters` : ''}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black text-xs font-semibold tracking-wide shadow-lg shadow-cyan-500/40 hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing…' : 'Analyze Origin →'}
              </button>
            </div>
          </div>


          <p className="relative mt-3 text-[10px] opacity-60">
            ⚠ This detector is experimental and can be wrong.
          </p>
        </section>

        {/* RIGHT – RESULT / ERROR PANEL */}
        {state !== 'empty' && (
  <section className="relative z-10 bg-black/40 border border-pink-500/25 rounded-2xl px-6 py-8 flex flex-col items-center text-center shadow-[0_0_40px_rgba(236,72,153,0.25)] overflow-hidden min-h-[420px]">
    <div className="absolute -top-24 -right-20 w-56 h-56 bg-pink-500/30 blur-3xl rounded-full" />
    <div className="absolute -bottom-32 -left-10 w-64 h-64 bg-cyan-500/30 blur-3xl rounded-full" />

    {/* LOADING STATE */}
    {state === 'loading' && (
      <>
        <div className="relative mb-4 w-32 h-32 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-cyan-400/40 border-t-transparent animate-spin" />
        </div>
        <h3 className="relative text-lg font-semibold opacity-80">
          Scanning code patterns…
        </h3>
        <p className="relative text-xs opacity-60 mt-2 max-w-xs">
          Analyzing structure, style, and complexity.
        </p>
      </>
    )}

    {/* ERROR STATE */}
    {state === 'error' && (
      <div className="relative w-full max-w-md bg-red-900/40 border border-red-500/60 rounded-2xl p-6 text-left">
        <h3 className="text-sm font-semibold text-red-300 mb-2">
          Server not reachable
        </h3>
        <p className="text-xs text-red-100/90 mb-4">
          {errorMessage || 'Something went wrong talking to the backend.'}
        </p>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !code.trim()}
          className="px-4 py-1.5 rounded-full bg-red-500 text-xs font-semibold text-white hover:bg-red-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Retry
        </button>
      </div>
    )}

    {/* RESULT STATE */}
    {state === 'result' && result && (
      <div className="relative w-full max-w-md mx-auto space-y-6">
        {/* badge + model */}
        <div className="flex flex-col items-center gap-2 mb-1">
          <span
            className={`px-6 py-2 text-xs font-semibold rounded-full border-2 ${
              result.type === 'ai'
                ? 'border-pink-400/70 text-pink-300 bg-pink-500/10'
                : 'border-cyan-400/70 text-cyan-300 bg-cyan-500/10'
            }`}
          >
            {result.type === 'ai' ? 'AI-Generated' : 'Human-Written'}
          </span>
          {result.model && (
            <span className="text-[11px] text-slate-400">
              Model:{' '}
              <span className="font-mono text-slate-200">{result.model}</span>
            </span>
          )}
        </div>

              {lastAnalyzedAt && (
              <p className="text-[11px] text-slate-400 mt-1">
                Last analyzed at {lastAnalyzedAt}
              </p>
              )}

            {analysisDuration !== null && (
            <p className="text-[11px] text-slate-400 mt-1">
              Analysis took {analysisDuration}s
            </p>
            )}


        {/* confidence */}
        <div className="bg-black/60 border border-cyan-500/30 rounded-2xl p-5">
          <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {animatedConfidence}%

          </div>
          <p className="text-xs opacity-60 mb-1">Confidence level</p>
          <p className={`text-xs font-semibold ${
          getConfidenceLabel(result.confidence).color
            }`}
          >
            {getConfidenceLabel(result.confidence).label} Confidence
          </p>


          <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-lg shadow-cyan-500/50 transition-all"
              style={{
                      width: `${animatedConfidence}%`,
                      transition: 'width 1.2s ease-out',
                    }}
            />
          </div>
        </div>

          <button
          onClick={handleCopyResult}
          className="w-full mt-3 px-4 py-2 rounded-full bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 transition"
          >
          📋 Copy Result
          </button>


        {/* reasons */}
        <div className="bg-black/60 border border-pink-500/30 rounded-2xl p-5 text-left">
          <p className="text-xs font-semibold mb-3 text-pink-300">
            Why we think this:
          </p>
          <ul className="space-y-2 text-[11px] opacity-80">
            {result.reasons.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex-shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </section>
)}


        {/* HISTORY PANEL */}
        <section className="relative z-10 col-span-1 md:col-span-2 bg-black/40 border border-slate-700/60 rounded-2xl p-4 mt-2 overflow-hidden">
          <h3 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-300 mb-3">
            Analysis history
          </h3>
          {history.length === 0 ? (
            <p className="text-[11px] text-slate-400">
              Run an analysis to see a list of recent results.
            </p>
          ) : (
            <ul className="space-y-1 max-h-60 overflow-auto text-[11px]">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-start gap-3 border-b border-slate-800/80 pb-1 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{item.timestamp}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 uppercase">
                        {item.language}
                      </span>
                    </div>
                    <div className="text-slate-400 mt-[2px]">
                      {item.codePreview}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {item.status === 'success' && item.result && (
                      <>
                        <div
                          className={`text-[11px] ${
                            item.result.type === 'ai'
                              ? 'text-pink-300'
                              : 'text-cyan-300'
                          }`}
                        >
                          {item.result.type === 'ai'
                            ? 'AI-Generated'
                            : 'Human-Written'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.result.confidence}%
                        </div>
                      </>
                    )}
                    {item.status === 'error' && (
                      <div className="text-[11px] text-red-400">Error</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
