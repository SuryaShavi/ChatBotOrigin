import React from 'react';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#020617] via-[#020016] to-black text-white">
      {/* HEADER */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur border-b border-cyan-500/10">
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          CodeOrigin
        </div>

        <nav className="flex gap-4 text-xs tracking-[0.18em] uppercase">
          <button className="opacity-70 hover:opacity-100 hover:text-cyan-300 transition">
            About
          </button>
          <button className="opacity-70 hover:opacity-100 hover:text-purple-300 transition">
            API
          </button>
          <button className="opacity-70 hover:opacity-100 hover:text-pink-300 transition">
            Docs
          </button>
        </nav>
      </header>

      {/* MAIN LAYOUT */}
      <main className="h-[calc(100vh-64px)] px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
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
          />

          <div className="relative mt-4 flex items-center justify-between gap-3">
            <select className="bg-black/60 text-xs rounded-full px-3 py-2 border border-purple-500/40 outline-none tracking-wide">
              <option>Auto</option>
              <option>Java</option>
              <option>Python</option>
              <option>JavaScript</option>
              <option>C++</option>
            </select>

            <button className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black text-xs font-semibold tracking-wide shadow-lg shadow-cyan-500/40 hover:brightness-110 transition">
              Analyze Origin →
            </button>
          </div>

          <p className="relative mt-3 text-[10px] opacity-60">
            ⚠ This detector is experimental and can be wrong.
          </p>
        </section>

        {/* RIGHT – RESULT PANEL (DEFAULT STATE) */}
        <section className="relative z-10 bg-black/40 border border-pink-500/25 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(236,72,153,0.25)] overflow-hidden">
          <div className="absolute -top-24 -right-20 w-56 h-56 bg-pink-500/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-32 -left-10 w-64 h-64 bg-cyan-500/30 blur-3xl rounded-full" />

          <div className="relative mb-4 w-32 h-32 rounded-full border border-cyan-400/40 flex items-center justify-center bg-gradient-to-br from-purple-600/40 to-cyan-500/10 shadow-lg">
            <div className="w-24 h-24 rounded-full border border-dashed border-cyan-300/50 flex items-center justify-center bg-black/80">
              <div className="w-4 h-4 rounded-full bg-cyan-300 blur-sm" />
            </div>
          </div>

          <h3 className="relative text-lg font-semibold opacity-80">
            Awaiting code sample…
          </h3>
          <p className="relative text-xs opacity-60 mt-2 max-w-xs">
            Paste some code on the left and click <span className="font-semibold">Analyze Origin</span>.
          </p>
        </section>
      </main>
    </div>
  );
};

export default App;
