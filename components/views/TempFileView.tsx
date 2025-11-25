import React from 'react';
import { AppContextType } from '../../types';

const TempFileView: React.FC<{ app: AppContextType }> = ({ app }) => {
  const file = app.getFileById(app.activeFileId || '');
  
  if (!file) return <div className="p-4 text-red-500">File not found</div>;

  return (
    <div className="h-full flex flex-col font-mono text-sm relative">
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2 text-yellow-500 text-xs flex items-center justify-center select-none">
            ⚠️ WARNING: This is a temporary scratchpad. Content will be lost when tab is closed.
        </div>
        <textarea
            className="flex-1 bg-transparent p-6 resize-none outline-none text-[var(--text-primary)] font-mono leading-relaxed"
            value={file.content || ''}
            onChange={(e) => app.updateTempFile(file.id, e.target.value)}
            placeholder="// Start typing your notes here..."
            spellCheck={false}
            autoFocus
        />
    </div>
  );
};

export default TempFileView;