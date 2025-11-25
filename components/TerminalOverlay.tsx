
import React, { useEffect, useRef } from 'react';
import { AppContextType } from '../types';
import Icon from './Icon';

interface TerminalOverlayProps {
  app: AppContextType;
}

const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ app }) => {
  const { isOpen, lines, redirectUrl, isComplete } = app.terminalState;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 anim-fade">
      <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-2xl border border-[#3e3e42] overflow-hidden flex flex-col font-mono text-sm h-[400px]">
        {/* Terminal Title Bar */}
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3e3e42] select-none">
          <div className="flex items-center gap-2">
            <Icon name="terminal" size={14} className="text-[#cccccc]" />
            <span className="text-[#cccccc] font-bold">suman@iitm-bs:~</span>
          </div>
          <div className="flex gap-2">
             <div onClick={app.closeTerminal} className="cursor-pointer hover:bg-white/10 p-1 rounded"><Icon name="x" size={14} className="text-[#cccccc]"/></div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 bg-[#0c0c0c] p-4 overflow-y-auto scrollbar-thin text-[#cccccc]">
          {lines.map((line, index) => (
            <div key={index} className="mb-1 break-words">
              {(line && line.startsWith('>')) ? (
                <span className="text-[var(--accent)] font-bold">{line}</span>
              ) : (line && line.includes('[SUCCESS]')) ? (
                <span className="text-green-400">{line}</span>
              ) : (line && line.includes('[ERROR]')) ? (
                <span className="text-red-400">{line}</span>
              ) : (line && line.includes('[INFO]')) ? (
                 <span className="text-blue-400">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
          {!isComplete && (
            <div className="mt-2">
                <div className="loader-bar w-1/2"></div>
            </div>
          )}
          {isComplete && redirectUrl && (
             <div className="mt-4 text-center">
                 <p className="mb-2 text-green-400">Process Completed Successfully.</p>
                 <button 
                    onClick={() => {
                        window.open(redirectUrl, '_blank');
                        app.closeTerminal();
                    }}
                    className="bg-[var(--accent)] text-[#1e1e1e] px-4 py-2 rounded font-bold hover:opacity-90 transition-opacity"
                 >
                    Open Link External
                 </button>
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default TerminalOverlay;
