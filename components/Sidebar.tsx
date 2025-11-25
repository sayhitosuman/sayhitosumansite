
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { AppContextType, FileNode, FolderNode, FileType } from '../types';
import { FILE_SYSTEM, BLOG_POSTS } from '../constants';

interface SidebarProps {
  app: AppContextType;
}

const Sidebar: React.FC<SidebarProps> = ({ app }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);

  // Close context menu on global click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
      e.preventDefault();
      // Only allow context menu for temporary files as requested
      if (fileId && fileId.startsWith('temp_')) {
          setContextMenu({
              x: e.clientX,
              y: e.clientY,
              fileId: fileId
          });
      }
  };

  const handleSaveTempFile = () => {
      if (!contextMenu) return;
      const file = app.getFileById(contextMenu.fileId);
      if (file && file.content) {
          const blob = new Blob([file.content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name || 'untitled.txt';
          a.click();
          URL.revokeObjectURL(url);
      } else {
          alert("File is empty or not found.");
      }
      setContextMenu(null);
  };

  const handleCloseTempFile = () => {
      if (!contextMenu) return;
      // Pass null as event to bypass the 'use context menu' alert
      app.closeFile(null, contextMenu.fileId);
      setContextMenu(null);
  };

  const getFileIconColor = (type: FileType) => {
    switch(type) {
      case 'py': return 'text-blue-400';
      case 'json': return 'text-yellow-400';
      case 'yaml': return 'text-red-400';
      case 'tsx': return 'text-cyan-400';
      case 'css': return 'text-sky-300';
      case 'md': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getFileIcon = (type: FileType) => {
    switch(type) {
      case 'py': return '🐍';
      case 'json': return '{}';
      case 'yaml': return '!';
      case 'md': return 'MD';
      case 'tsx': return '⚛️';
      case 'css': return '#';
      default: return '📄';
    }
  };

  const renderFile = (file: FileNode, depth: number) => {
    const isActive = app.activeFileId === file.id;
    return (
      <div 
        key={file.id}
        className={`flex items-center py-1 cursor-pointer text-sm transition-colors ${isActive ? 'bg-[var(--selection)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tab)]'}`}
        style={{ paddingLeft: `${depth * 12 + 10}px` }}
        onClick={() => app.openFile(file.id)}
        onContextMenu={(e) => handleContextMenu(e, file.id)}
      >
        <span className={`mr-1.5 text-[10px] w-4 text-center ${getFileIconColor(file.type)}`}>
          {getFileIcon(file.type)}
        </span>
        <span className="truncate">{file.name}</span>
      </div>
    );
  };

  const renderFolder = (folder: FolderNode, depth: number) => {
    const isExpanded = app.expandedFolders.includes(folder.id);
    const isPortfolio = folder.id === 'portfolio';

    return (
      <div key={folder.id}>
        <div 
          className="flex items-center py-1 cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tab)] font-bold text-xs select-none"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => app.toggleFolder(folder.id)}
        >
          <Icon 
            name={isExpanded ? 'chevronDown' : 'chevronRight'} 
            size={14} 
            className={`mr-1 transition-transform ${isExpanded ? '' : '-rotate-90'}`} 
          />
          <span className="uppercase tracking-wider">{folder.name}</span>
        </div>
        {isExpanded && (
          <div>
            {/* If this is the main portfolio folder, inject the scratchpad folder if needed */}
            {isPortfolio && app.tempFiles.length > 0 && (
                <div key="scratchpad-folder">
                    <div 
                        className="flex items-center py-1 cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-tab)] font-bold text-xs select-none"
                        style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
                        onClick={() => app.toggleFolder('scratchpad')}
                    >
                        <Icon 
                            name={app.expandedFolders.includes('scratchpad') ? 'chevronDown' : 'chevronRight'} 
                            size={14} 
                            className={`mr-1 transition-transform ${app.expandedFolders.includes('scratchpad') ? '' : '-rotate-90'}`} 
                        />
                        <span className="uppercase tracking-wider">scratchpad</span>
                    </div>
                    {app.expandedFolders.includes('scratchpad') && (
                        <div>
                            {app.tempFiles.map(file => renderFile(file, depth + 2))}
                        </div>
                    )}
                </div>
            )}

            {folder.folders?.map(subFolder => renderFolder(subFolder, depth + 1))}
            {folder.files.map(file => renderFile(file, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Common styling for the sidebar container
  const sidebarStyle = {
    width: app.sidebarOpen ? `${app.sidebarWidth}px` : '0px',
    opacity: app.sidebarOpen ? 1 : 0,
    overflow: 'hidden',
    flexShrink: 0
  };

  // Extensions Sidebar Content
  if (app.activeSideBarIcon === 'extensions') {
    return (
        <div className="flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border)] transition-all duration-75" style={sidebarStyle}>
             <div className="p-3 pl-4 text-xs font-bold text-[var(--text-secondary)] flex items-center justify-between uppercase tracking-wider bg-[var(--bg-sidebar)] flex-shrink-0">
                <span className="truncate">Extensions</span>
                <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <Icon name="refresh" size={14} />
                </div>
            </div>
            <div className="p-2 flex-shrink-0">
                <input type="text" placeholder="Search Extensions" className="w-full bg-[var(--bg-main)] border border-[var(--border)] p-1 text-xs text-[var(--text-primary)] outline-none mb-2"/>
            </div>
            <div className="flex-1 overflow-y-auto min-w-[200px]">
                <div className="px-4 py-2 text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-activity)]">INSTALLED</div>
                <div 
                    className="flex items-center p-2 cursor-pointer hover:bg-[var(--bg-tab)] text-[var(--text-primary)] gap-2 border-l-2 border-transparent hover:border-[var(--accent)]"
                    onClick={() => app.openFile('extensions_view')} 
                >
                    <Icon name="extensions" size={24} className="text-[var(--accent)] flex-shrink-0"/>
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-sm truncate">Social Connectors</span>
                        <span className="text-[10px] text-[var(--text-secondary)] truncate">Suman Mandal</span>
                    </div>
                </div>
                 <div className="flex items-center p-2 cursor-default opacity-50 text-[var(--text-primary)] gap-2">
                    <div className="w-6 h-6 bg-blue-500/20 flex items-center justify-center rounded text-blue-400 font-bold text-xs flex-shrink-0">Py</div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-sm truncate">Python</span>
                        <span className="text-[10px] text-[var(--text-secondary)] truncate">Microsoft</span>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  // Search Sidebar Content
  if (app.activeSideBarIcon === 'search') {
    const filteredPosts = BLOG_POSTS.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border)] transition-all duration-75" style={sidebarStyle}>
             <div className="p-3 pl-4 text-xs font-bold text-[var(--text-secondary)] flex items-center justify-between uppercase tracking-wider bg-[var(--bg-sidebar)] flex-shrink-0">
                <span className="truncate">Search</span>
                <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                     <Icon name="refresh" size={14} onClick={() => setSearchQuery('')}/>
                </div>
            </div>
             <div className="p-3 flex-shrink-0">
                 <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search blogs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--bg-main)] border border-[var(--border)] p-1 pl-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                 </div>
            </div>
             <div className="flex-1 overflow-y-auto min-w-[200px]">
                 <div className="px-4 py-1 text-xs font-bold text-[var(--text-secondary)] mb-2">RESULTS</div>
                 
                 {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <div 
                            key={post.id} 
                            className="px-4 py-2 cursor-pointer hover:bg-[var(--bg-tab)] border-l-2 border-transparent hover:border-[var(--accent)] group"
                            onClick={() => app.openFile(post.id)}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Icon name="files" size={12} className="text-[var(--text-secondary)] flex-shrink-0"/>
                                <span className="text-sm font-bold text-[var(--text-primary)] truncate">{post.title}</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2">{post.summary}</p>
                        </div>
                    ))
                 ) : (
                    <div className="px-4 py-4 text-center text-[var(--text-secondary)] text-xs italic">
                        No results found.
                    </div>
                 )}
            </div>
        </div>
    )
  }

  // Default Files Sidebar
  return (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)] border-r border-[var(--border)] transition-all duration-75 relative" style={sidebarStyle}>
      <div className="p-3 pl-4 text-xs font-bold text-[var(--text-secondary)] flex items-center justify-between uppercase tracking-wider bg-[var(--bg-sidebar)] flex-shrink-0">
        <span className="truncate">Explorer</span>
        <div className="flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
          <Icon name="menu" size={14} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin min-w-[200px]">
        {/* OPEN EDITORS SECTION - Shows ALL open files */}
        {app.openFiles.length > 0 && (
            <div className="mb-2">
                <div className="flex items-center py-1 px-4 text-[var(--text-secondary)] font-bold text-xs select-none">
                    <Icon name="chevronDown" size={14} className="mr-1" />
                    <span>OPEN EDITORS</span>
                </div>
                <div>
                    {app.openFiles.map(fileId => {
                        // Resolve file object for rendering
                        const file = app.getFileById(fileId) || BLOG_POSTS.find(b => b.id === fileId);
                        // Fallback object for special views if needed
                        const displayFile = file 
                            ? (file as FileNode) // It matches FileNode shape reasonably well for rendering or we cast it
                            : { 
                                id: fileId, 
                                name: fileId === 'extensions_view' ? 'Extensions' : 'Unknown', 
                                type: 'txt' as FileType, 
                                path: '' 
                              };
                        
                        // If it's a blog post, adapt it to FileNode shape for renderFile
                        if (!file && BLOG_POSTS.find(b => b.id === fileId)) {
                             const blog = BLOG_POSTS.find(b => b.id === fileId)!;
                             displayFile.name = blog.title;
                             displayFile.type = 'md';
                        }
                        
                        return renderFile(displayFile, 1);
                    })}
                </div>
            </div>
        )}

        {/* MAIN FILE TREE */}
        {FILE_SYSTEM.map(folder => renderFolder(folder, 0))}
      </div>

      {/* Custom Context Menu Overlay */}
      {contextMenu && (
          <div 
            className="fixed z-50 bg-[#252526] border border-[var(--border)] shadow-xl rounded-sm py-1 w-48 text-[var(--text-primary)] text-xs animate-in fade-in zoom-in-95 duration-75"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
              <div 
                className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer"
                onClick={handleSaveTempFile}
              >
                  Save As...
              </div>
              <div className="my-1 border-b border-[var(--border)] opacity-50"></div>
              <div 
                className="px-4 py-1.5 hover:bg-red-600 hover:text-white cursor-pointer"
                onClick={handleCloseTempFile}
              >
                  Close File
              </div>
          </div>
      )}
    </div>
  );
};

export default Sidebar;
