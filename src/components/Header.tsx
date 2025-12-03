import React from 'react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="relative border-b border-cyan-500/10 backdrop-blur-md bg-black/30">
      <div className="max-w-[1440px] w-full mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            CodeOrigin
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="text-cyan-100/80 hover:text-cyan-100 hover:bg-cyan-500/10 transition-colors"
          >
            About
          </Button>
          <Button 
            variant="ghost" 
            className="text-cyan-100/80 hover:text-cyan-100 hover:bg-cyan-500/10 transition-colors"
          >
            API
          </Button>
          <Button 
            variant="ghost" 
            className="text-cyan-100/80 hover:text-cyan-100 hover:bg-cyan-500/10 transition-colors"
          >
            Docs
          </Button>
        </nav>
      </div>
    </header>
  );
}
