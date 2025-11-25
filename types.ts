
import React from 'react';

export type FileType = 'md' | 'py' | 'json' | 'yaml' | 'sh' | 'tsx' | 'css' | 'txt';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  path: string;
  content?: string; // Optional raw content
}

export interface FolderNode {
  id: string;
  name: string;
  files: FileNode[];
  folders?: FolderNode[]; // Nested folders
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export type ThemeMode = 'dark' | 'light';

export interface TerminalState {
  isOpen: boolean;
  lines: string[];
  redirectUrl: string | null;
  isComplete: boolean;
}

export interface AppState {
  theme: ThemeMode;
  activeFileId: string | null;
  openFiles: string[];
  expandedFolders: string[];
  sidebarOpen: boolean;
  sidebarWidth: number;
  activeSideBarIcon: string;
  terminalState: TerminalState;
  tempFiles: FileNode[];
  zoomLevel: number;
  showPreview: boolean; // New State
  chatOpen: boolean; // Chat State
  chatWidth: number; // Chat Width State
  previewWidth: number; // Preview Width State
}

export interface AppContextType extends AppState {
  setTheme: (theme: ThemeMode) => void;
  setActiveFileId: (id: string | null) => void;
  toggleFolder: (folderId: string) => void;
  openFile: (fileId: string) => void;
  closeFile: (e: React.MouseEvent | null, fileId: string) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setActiveSideBarIcon: (icon: string) => void;
  getFileById: (id: string) => FileNode | undefined;
  runTerminalCommand: (lines: string[], url?: string) => void;
  closeTerminal: () => void;
  updateTempFile: (id: string, content: string) => void;
  setZoomLevel: (level: number) => void;
  setShowPreview: (show: boolean) => void; // New Setter
  setChatOpen: (isOpen: boolean) => void; // Chat Setter
  setChatWidth: (width: number) => void; // Chat Width Setter
  setPreviewWidth: (width: number) => void; // Preview Width Setter
  startResizingPreview: () => void; // Start Resizing Preview
}