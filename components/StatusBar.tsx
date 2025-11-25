import React from 'react';
import Icon from './Icon';
import { AppContextType } from '../types';

const StatusBar: React.FC<{ app: AppContextType }> = ({ app }) => {
  const activeFile = app.activeFileId ? app.getFileById(app.activeFileId) : null;
  const fileType = activeFile?.type.toUpperCase() || 'TXT';

  return (
    <div className="h-6 bg-[var(--accent)] text-[var(--bg-main)] flex items-center justify-between px-3 text-xs select-none font-medium z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer">
            <Icon name="git" size={12} /> main*
        </span>
        <span className="flex items-center gap-1 hover:bg-black/10 px-1 rounded cursor-pointer">
            <Icon name="alert" size={12} /> 0
        </span>
      </div>
      <div className="flex items-center gap-4 hidden sm:flex">
        <span className="hover:bg-black/10 px-1 rounded cursor-pointer">Ln 12, Col 84</span>
        <span className="hover:bg-black/10 px-1 rounded cursor-pointer">UTF-8</span>
        <span className="hover:bg-black/10 px-1 rounded cursor-pointer">{fileType}</span>
      </div>
    </div>
  );
};

export default StatusBar;