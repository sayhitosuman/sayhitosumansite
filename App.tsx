
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppContextType, FileNode, ThemeMode, TerminalState } from './types';
import { FILE_SYSTEM, THEMES, GLOBAL_CSS } from './constants';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import StatusBar from './components/StatusBar';
import Icon from './components/Icon';
import TerminalOverlay from './components/TerminalOverlay';
import ChatPanel from './components/ChatPanel'; // Import ChatPanel

export default function App() {
    // State
    const [theme, setTheme] = useState<ThemeMode>('dark');
    const [activeFileId, setActiveFileId] = useState<string | null>('home');
    const [openFiles, setOpenFiles] = useState<string[]>(['home']);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(250); // Default sidebar width
    const [activeSideBarIcon, setActiveSideBarIcon] = useState('files');
    const [expandedFolders, setExpandedFolders] = useState<string[]>(['portfolio', 'src', 'config', 'models']);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [showPreview, setShowPreview] = useState(false); // New Preview State
    const [chatOpen, setChatOpen] = useState(false); // Chat State
    const [chatWidth, setChatWidth] = useState(320); // Chat Width State
    const [previewWidth, setPreviewWidth] = useState(500); // Default Preview Width

    // Temp Files State
    const [tempFiles, setTempFiles] = useState<FileNode[]>([]);
    // History State: { fileId: { past: string[], future: string[] } }
    const [fileHistory, setFileHistory] = useState<Record<string, { past: string[], future: string[] }>>({});

    // Menu State
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // Window Control State
    const [sessionActive, setSessionActive] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);

    // Resizing State
    const [isResizing, setIsResizing] = useState(false);
    const [isResizingChat, setIsResizingChat] = useState(false);
    const [isResizingPreview, setIsResizingPreview] = useState(false);

    const sidebarRef = useRef<HTMLDivElement>(null);

    // Terminal State
    const [terminalState, setTerminalState] = useState<TerminalState>({
        isOpen: false,
        lines: [],
        redirectUrl: null,
        isComplete: false
    });

    // --- Helpers ---

    // File Lookup Helper
    const getFileById = (id: string): FileNode | undefined => {
        // Check Temp Files First
        const tempFile = tempFiles.find(f => f.id === id);
        if (tempFile) return tempFile;

        const findFile = (folders: typeof FILE_SYSTEM): FileNode | undefined => {
            for (const folder of folders) {
                const file = folder.files.find(f => f.id === id);
                if (file) return file;
                if (folder.folders) {
                    const nested = findFile(folder.folders);
                    if (nested) return nested;
                }
            }
            return undefined;
        };
        return findFile(FILE_SYSTEM);
    };

    // Flatten files for "Open File" menu
    const getAllFiles = (): FileNode[] => {
        const files: FileNode[] = [];
        const traverse = (folders: typeof FILE_SYSTEM) => {
            for (const folder of folders) {
                files.push(...folder.files);
                if (folder.folders) traverse(folder.folders);
            }
        };
        traverse(FILE_SYSTEM);
        // Add temp files to menu list
        files.push(...tempFiles);
        return files;
    };

    // --- Actions ---
    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev =>
            prev.includes(folderId)
                ? prev.filter(f => f !== folderId)
                : [...prev, folderId]
        );
    };

    const openFile = (fileId: string) => {
        if (!openFiles.includes(fileId)) {
            setOpenFiles(prev => [...prev, fileId]);
        }
        setActiveFileId(fileId);

        // Only switch sidebar if it's a regular file or temp file, to avoid jumping contexts too much
        if (getFileById(fileId)) {
            setActiveSideBarIcon('files');
        }

        // On mobile, auto-close sidebar when file opens
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const closeFile = (e: React.MouseEvent | null, fileId: string) => {
        e?.stopPropagation();

        if (!fileId) return;

        // Check for temp file warning
        if (fileId && fileId.startsWith('temp_')) {
            // If event (e) is present, it means the user clicked the Tab Close button.
            // We block this action and instruct them to use the Explorer Context Menu.
            if (e) {
                alert("Action Blocked: Please use the Explorer context menu (Right Click on the file in the sidebar) to manage/close temporary files.");
                return;
            }

            // If event is null (called programmatically from Context Menu), we proceed with a final confirmation.
            if (!window.confirm("WARNING: Closing this temporary file will discard all content. Are you sure?")) {
                return;
            }
            // Remove from tempFiles
            setTempFiles(prev => prev.filter(f => f.id !== fileId));
            // Clean up history
            setFileHistory(prev => {
                const newHistory = { ...prev };
                delete newHistory[fileId];
                return newHistory;
            });
        }

        const newOpenFiles = openFiles.filter(id => id !== fileId);
        setOpenFiles(newOpenFiles);

        if (activeFileId === fileId) {
            if (newOpenFiles.length > 0) {
                setActiveFileId(newOpenFiles[newOpenFiles.length - 1]);
            } else {
                setActiveFileId(null);
            }
        }
    };

    const handleNewFile = () => {
        const id = `temp_${Date.now()}`;
        const newFile: FileNode = {
            id,
            name: 'Untitled.txt',
            type: 'txt',
            path: 'scratchpad/Untitled.txt',
            content: ''
        };
        setTempFiles(prev => [...prev, newFile]);
        setOpenFiles(prev => [...prev, id]);
        setActiveFileId(id);
        setActiveMenu(null);
        // Initialize history
        setFileHistory(prev => ({ ...prev, [id]: { past: [], future: [] } }));
    };

    const updateTempFile = (id: string, content: string) => {
        // Find current file to save state to history
        const currentFile = tempFiles.find(f => f.id === id);
        if (currentFile) {
            setFileHistory(prev => {
                const hist = prev[id] || { past: [], future: [] };
                // Only push if content changed significantly or debounce (simplified here)
                if (hist.past[hist.past.length - 1] !== currentFile.content) {
                    return {
                        ...prev,
                        [id]: {
                            past: [...hist.past, currentFile.content || ''],
                            future: [] // New change clears future
                        }
                    };
                }
                return prev;
            });
        }
        setTempFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
    };

    // --- Edit Handlers ---
    const handleUndo = () => {
        const id = activeFileId;
        if (!id || !id.startsWith('temp_')) return;

        const history = fileHistory[id];
        if (!history || history.past.length === 0) return;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);
        const currentContent = tempFiles.find(f => f.id === id)?.content || '';

        setTempFiles(prev => prev.map(f => f.id === id ? { ...f, content: previous } : f));
        setFileHistory(prev => ({
            ...prev,
            [id]: {
                past: newPast,
                future: [currentContent, ...history.future]
            }
        }));
        setActiveMenu(null);
    };

    const handleRedo = () => {
        const id = activeFileId;
        if (!id || !id.startsWith('temp_')) return;

        const history = fileHistory[id];
        if (!history || history.future.length === 0) return;

        const next = history.future[0];
        const newFuture = history.future.slice(1);
        const currentContent = tempFiles.find(f => f.id === id)?.content || '';

        setTempFiles(prev => prev.map(f => f.id === id ? { ...f, content: next } : f));
        setFileHistory(prev => ({
            ...prev,
            [id]: {
                past: [...history.past, currentContent],
                future: newFuture
            }
        }));
        setActiveMenu(null);
    };

    const handleCopy = () => {
        const id = activeFileId;
        if (!id || !id.startsWith('temp_')) return;
        const content = tempFiles.find(f => f.id === id)?.content || '';
        navigator.clipboard.writeText(content);
        setActiveMenu(null);
    };

    const handlePaste = async () => {
        const id = activeFileId;
        if (!id || !id.startsWith('temp_')) return;

        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                const currentContent = tempFiles.find(f => f.id === id)?.content || '';
                updateTempFile(id, currentContent + text);
                setActiveMenu(null);
            }
        } catch (err) {
            console.error(err);
            // Fallback for environments where readText is blocked
            alert("Clipboard access denied. Please use Ctrl+V in the editor directly.");
        }
    };


    // Window Controls Logic
    const handleCloseWindow = () => {
        if (window.confirm("Are you sure you want to close the session? Unsaved changes to 'Universe' may be lost.")) {
            setSessionActive(false);
        }
    };

    const handleMinimizeWindow = () => {
        // If in fullscreen, exit fullscreen first (restore normal window)
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error(err));
            // We do not set isMinimized to true here, we just restore to 'normal' view
        } else {
            // If not in fullscreen, then actually minimize (hide content)
            setIsMinimized(!isMinimized);
        }
    };

    const handleMaximizeWindow = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Menu Actions
    const handleMenuClick = (menu: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const handleSaveShortcut = () => {
        const shortcutContent = `[InternetShortcut]\nURL=${window.location.href}`;
        const blob = new Blob([shortcutContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Suman_Mandal_Portfolio.url';
        a.click();
        URL.revokeObjectURL(url);
        setActiveMenu(null);
        alert("Shortcut saved to your computer!");
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setActiveMenu(null);
        alert("Link copied to clipboard!");
    };

    // Run Handler (Download Temp File)
    const handleRunActiveFile = () => {
        if (!activeFileId || !activeFileId.startsWith('temp_')) return;

        const file = tempFiles.find(f => f.id === activeFileId);
        if (!file) return;

        const blob = new Blob([file.content || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name || 'Untitled.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setActiveMenu(null);

        // Simulate "Running" feedback
        runTerminalCommand([
            `> executing ${file.path}...`,
            '[INFO] Spawning local process...',
            '[SUCCESS] File downloaded for local execution.',
            'Opening default text editor...'
        ]);
    };

    // Click Outside to Close Menu
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);


    // Resizing Logic
    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const startResizingChat = useCallback(() => {
        setIsResizingChat(true);
    }, []);

    const startResizingPreview = useCallback(() => {
        setIsResizingPreview(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
        setIsResizingChat(false);
        setIsResizingPreview(false);
    }, []);

    const resize = useCallback((mouseMoveEvent: MouseEvent) => {
        if (isResizing) {
            // 48 is roughly the width of the ActivityBar
            const newWidth = mouseMoveEvent.clientX - 48;
            if (newWidth > 150 && newWidth < 600) {
                setSidebarWidth(newWidth);
            }
        }
        if (isResizingChat) {
            // Chat is on the right, so dragging left increases width
            const newWidth = window.innerWidth - mouseMoveEvent.clientX;
            if (newWidth > 250 && newWidth < 800) {
                setChatWidth(newWidth);
            }
        }
        if (isResizingPreview) {
            // Preview is on the right of the editor.
            // We can calculate width based on the editor container, but simplified:
            // If we assume the resize handle is being dragged, we can use clientX.
            // However, the preview is inside the editor area.
            // Let's assume the preview is on the right side of the split view.
            // The width would be (Editor Area Width) - (Mouse Position relative to Editor).
            // A simpler approach for the split view is to track the width directly.
            // Since the preview is on the right, let's say we track its width.
            // Dragging left increases width.
            // We need to know the right edge of the editor area or just use window width if it's full width.
            // But the sidebar might be open.
            // Let's try: newWidth = (Window Width - Sidebar Width - ActivityBar) - MouseX
            // Wait, that assumes the preview is anchored to the right of the window? No, it's inside the editor.
            // Actually, the previous implementation was 50% width.
            // Let's use a simpler approach:
            // The mouse movement delta determines the change.
            // But for absolute positioning:
            // The preview is on the right. So `right` edge is fixed (or relative to container).
            // Let's calculate based on window width for now, subtracting the sidebar if open.
            // Actually, `Editor` takes up the remaining space.
            // So `Preview Width` = `Window Width` - `Sidebar Width` - `ActivityBar` - `Mouse X`.
            // Let's refine this.
            // Mouse X is the position of the splitter.
            // So the content to the left (Editor) is `Mouse X - Sidebar Width - ActivityBar`.
            // And the content to the right (Preview) is `Total Width - (Mouse X - Sidebar Width - ActivityBar)`.
            // Wait, simpler: `Preview Width` = `Window Width` - `Mouse X`.
            // This works if the preview is on the far right of the window (minus Chat if open).
            // If Chat is open, it's `Window Width - Chat Width - Mouse X`.
            // Let's stick to `Window Width - Mouse X` for now, and adjust if Chat is open.
            // If Chat is open, the preview is to the left of Chat.
            // So the splitter is at `Mouse X`.
            // The right edge of the preview is at `Window Width - Chat Width`.
            // So `Preview Width` = `(Window Width - Chat Width) - Mouse X`.

            let rightEdge = window.innerWidth;
            if (chatOpen) rightEdge -= chatWidth;

            const newWidth = rightEdge - mouseMoveEvent.clientX;
            if (newWidth > 200 && newWidth < (window.innerWidth - sidebarWidth - 100)) {
                setPreviewWidth(newWidth);
            }
        }
    }, [isResizing, isResizingChat, isResizingPreview, chatOpen, chatWidth, sidebarWidth]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);


    // Terminal Logic
    const runTerminalCommand = (lines: string[], url?: string) => {
        setTerminalState({
            isOpen: true,
            lines: [],
            redirectUrl: url || null,
            isComplete: false
        });

        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < lines.length) {
                setTerminalState(prev => ({
                    ...prev,
                    lines: [...prev.lines, lines[currentLine]]
                }));
                currentLine++;
            } else {
                clearInterval(interval);
                setTerminalState(prev => ({
                    ...prev,
                    isComplete: true
                }));
            }
        }, 500);
    };

    const closeTerminal = () => {
        setTerminalState(prev => ({ ...prev, isOpen: false }));
    };

    const handleHelp = () => {
        alert("DevPortfolio IDE v1.2.0\nAuthor: Suman Mandal\nBuilt with React & Tailwind.");
    };

    // Context Object
    const appContext: AppContextType = {
        theme, setTheme,
        activeFileId, setActiveFileId,
        openFiles,
        expandedFolders,
        sidebarOpen, setSidebarOpen,
        sidebarWidth, setSidebarWidth,
        activeSideBarIcon, setActiveSideBarIcon,
        terminalState,
        toggleFolder,
        openFile,
        closeFile,
        getFileById,
        runTerminalCommand,
        closeTerminal,
        updateTempFile,
        tempFiles, // Passed state
        zoomLevel, setZoomLevel,
        showPreview, setShowPreview,
        chatOpen, setChatOpen, // Chat Context
        chatWidth, setChatWidth, // Chat Width Context
        previewWidth, setPreviewWidth, // Preview Width Context
        startResizingPreview // Handler
    };

    // Mobile responsiveness initialization
    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
            setExpandedFolders(['portfolio']); // Collapse most by default on mobile
        }
    }, []);

    if (!sessionActive) {
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center bg-black text-green-500 font-mono p-4 text-center">
                <div className="mb-4 text-6xl">Connection Terminated</div>
                <p className="mb-8 text-gray-400">Remote session closed by user.</p>
                <button
                    onClick={() => setSessionActive(true)}
                    className="border border-green-500 px-6 py-2 hover:bg-green-500 hover:text-black transition-colors"
                >
                    Re-establish Connection
                </button>
            </div>
        );
    }

    const isTempFileActive = activeFileId?.startsWith('temp_');

    return (
        <div
            className={`flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300 font-mono ${isResizing || isResizingChat || isResizingPreview ? 'cursor-col-resize select-none' : ''}`}
            style={{ zoom: zoomLevel } as any}
        >
            {/* Dynamic CSS Injection */}
            <style>{`:root { ${THEMES[theme]} } ${GLOBAL_CSS}`}</style>

            {/* Top Title Bar (VS Code Style with Mac Buttons) */}
            <div className="h-9 bg-[var(--bg-activity)] flex items-center justify-between px-4 text-xs text-[var(--text-secondary)] border-b border-[var(--border)] relative select-none flex-shrink-0 z-[100]">

                {/* Left: Window Controls + Menu */}
                <div className="flex items-center gap-4">
                    {/* Mac Traffic Lights */}
                    <div className="flex gap-2 group">
                        <div
                            onClick={handleCloseWindow}
                            className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 border border-transparent hover:border-black/10 cursor-pointer flex items-center justify-center text-black/50 font-bold leading-none text-[8px] transition-all"
                            title="Close Session"
                        >
                            <span className="opacity-0 group-hover:opacity-100">x</span>
                        </div>
                        <div
                            onClick={handleMinimizeWindow}
                            className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 border border-transparent hover:border-black/10 cursor-pointer flex items-center justify-center text-black/50 font-bold leading-none text-[8px] transition-all"
                            title="Minimize / Exit Fullscreen"
                        >
                            <span className="opacity-0 group-hover:opacity-100">-</span>
                        </div>
                        <div
                            onClick={handleMaximizeWindow}
                            className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 border border-transparent hover:border-black/10 cursor-pointer flex items-center justify-center text-black/50 font-bold leading-none text-[8px] transition-all"
                            title="Fullscreen"
                        >
                            <span className="opacity-0 group-hover:opacity-100">+</span>
                        </div>
                    </div>

                    {/* Interactive Menus */}
                    <div className="hidden md:flex gap-1 ml-2 text-[11px] relative">
                        {/* File Menu */}
                        <div className="relative">
                            <span
                                className={`hover:bg-[var(--bg-tab)] px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'file' ? 'bg-[var(--bg-tab)] text-[var(--text-primary)]' : ''}`}
                                onClick={(e) => handleMenuClick('file', e)}
                            >
                                File
                            </span>
                            {activeMenu === 'file' && (
                                <div className="absolute top-full left-0 w-56 bg-[var(--bg-sidebar)] shadow-2xl border border-[var(--border)] rounded-sm py-1 z-[100] text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-100" onClick={e => e.stopPropagation()}>

                                    <div className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer" onClick={handleNewFile}>
                                        New File...
                                    </div>

                                    <div className="group relative px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex justify-between items-center">
                                        <span>Open File...</span>
                                        <Icon name="chevronRight" size={10} />
                                        {/* Submenu */}
                                        <div className="hidden group-hover:block absolute left-full top-0 w-48 bg-[var(--bg-sidebar)] border border-[var(--border)] shadow-xl ml-[-1px]">
                                            {getAllFiles().map(file => (
                                                <div
                                                    key={file.id}
                                                    className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex items-center gap-2"
                                                    onClick={() => {
                                                        openFile(file.id);
                                                        setActiveMenu(null);
                                                    }}
                                                >
                                                    <span className="opacity-50 text-[10px]">{file.type.toUpperCase()}</span>
                                                    {file.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div
                                        className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex justify-between"
                                        onClick={() => {
                                            if (activeFileId) closeFile(null, activeFileId);
                                            setActiveMenu(null);
                                        }}
                                    >
                                        <span>Close Editor</span>
                                        <span className="text-[10px] opacity-50">Ctrl+W</span>
                                    </div>

                                    <div className="my-1 border-b border-[var(--border)] opacity-50"></div>

                                    <div className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer" onClick={() => { setActiveSideBarIcon('search'); setSidebarOpen(true); setActiveMenu(null); }}>
                                        Open Blogs
                                    </div>
                                    <div className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer" onClick={() => { setActiveSideBarIcon('extensions'); setSidebarOpen(true); setActiveMenu(null); }}>
                                        Open Extensions
                                    </div>

                                    <div className="my-1 border-b border-[var(--border)] opacity-50"></div>

                                    <div className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex justify-between" onClick={handleSaveShortcut}>
                                        <span>Save As Shortcut</span>
                                        <span className="text-[10px] opacity-50">Ctrl+S</span>
                                    </div>
                                    <div className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer" onClick={handleShare}>
                                        Share Link
                                    </div>

                                    <div className="my-1 border-b border-[var(--border)] opacity-50"></div>

                                    <div className="px-4 py-1.5 hover:bg-red-600 hover:text-white cursor-pointer" onClick={handleCloseWindow}>
                                        Exit
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Edit Menu */}
                        <div className="relative">
                            <span
                                className={`hover:bg-[var(--bg-tab)] px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'edit' ? 'bg-[var(--bg-tab)] text-[var(--text-primary)]' : ''}`}
                                onClick={(e) => handleMenuClick('edit', e)}
                            >
                                Edit
                            </span>
                            {activeMenu === 'edit' && (
                                <div className="absolute top-full left-0 w-56 bg-[var(--bg-sidebar)] shadow-2xl border border-[var(--border)] rounded-sm py-1 z-[100] text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-100" onClick={e => e.stopPropagation()}>
                                    <div
                                        className={`px-4 py-1.5 flex justify-between ${isTempFileActive ? 'hover:bg-[var(--accent)] hover:text-white cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={isTempFileActive ? handleUndo : undefined}
                                    >
                                        <span>Undo</span>
                                        <span className="text-[10px] opacity-50">Ctrl+Z</span>
                                    </div>
                                    <div
                                        className={`px-4 py-1.5 flex justify-between ${isTempFileActive ? 'hover:bg-[var(--accent)] hover:text-white cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={isTempFileActive ? handleRedo : undefined}
                                    >
                                        <span>Redo</span>
                                        <span className="text-[10px] opacity-50">Ctrl+Y</span>
                                    </div>
                                    <div className="my-1 border-b border-[var(--border)] opacity-50"></div>
                                    <div
                                        className={`px-4 py-1.5 flex justify-between ${isTempFileActive ? 'hover:bg-[var(--accent)] hover:text-white cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={isTempFileActive ? handleCopy : undefined}
                                    >
                                        <span>Copy File Content</span>
                                        <span className="text-[10px] opacity-50">Ctrl+C</span>
                                    </div>
                                    <div
                                        className={`px-4 py-1.5 flex justify-between ${isTempFileActive ? 'hover:bg-[var(--accent)] hover:text-white cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={isTempFileActive ? handlePaste : undefined}
                                    >
                                        <span>Paste to End</span>
                                        <span className="text-[10px] opacity-50">Ctrl+V</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* View Menu */}
                        <div className="relative">
                            <span
                                className={`hover:bg-[var(--bg-tab)] px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'view' ? 'bg-[var(--bg-tab)] text-[var(--text-primary)]' : ''}`}
                                onClick={(e) => handleMenuClick('view', e)}
                            >
                                View
                            </span>
                            {activeMenu === 'view' && (
                                <div className="absolute top-full left-0 w-56 bg-[var(--bg-sidebar)] shadow-2xl border border-[var(--border)] rounded-sm py-1 z-[100] text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-100" onClick={e => e.stopPropagation()}>
                                    <div
                                        className={`px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex justify-between ${activeFileId === 'about' ? '' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={() => {
                                            if (activeFileId === 'about') setShowPreview(!showPreview);
                                            setActiveMenu(null);
                                        }}
                                    >
                                        <span>Toggle Side Preview</span>
                                        <span className="text-[10px] opacity-50">{showPreview ? 'ON' : 'OFF'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <span className="hover:bg-[var(--bg-tab)] px-2 py-1 rounded cursor-pointer transition-colors opacity-80 hover:opacity-100">Go</span>
                        </div>

                        {/* Run Menu */}
                        <div className="relative">
                            <span
                                className={`hover:bg-[var(--bg-tab)] px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'run' ? 'bg-[var(--bg-tab)] text-[var(--text-primary)]' : ''}`}
                                onClick={(e) => handleMenuClick('run', e)}
                            >
                                Run
                            </span>
                            {activeMenu === 'run' && (
                                <div className="absolute top-full left-0 w-64 bg-[var(--bg-sidebar)] shadow-2xl border border-[var(--border)] rounded-sm py-1 z-[100] text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-100" onClick={e => e.stopPropagation()}>
                                    <div
                                        className={`px-4 py-1.5 flex justify-between ${isTempFileActive ? 'hover:bg-[var(--accent)] hover:text-white cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={isTempFileActive ? handleRunActiveFile : undefined}
                                        title="Downloads the file to open in your system's default editor"
                                    >
                                        <span>Run Without Debugging</span>
                                        <span className="text-[10px] opacity-50">Ctrl+F5</span>
                                    </div>
                                    <div className="px-4 py-1.5 opacity-50 cursor-not-allowed flex justify-between">
                                        <span>Start Debugging</span>
                                        <span className="text-[10px]">F5</span>
                                    </div>
                                    <div className="px-4 py-1.5 opacity-50 cursor-not-allowed flex justify-between">
                                        <span>Add Configuration...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Terminal Menu */}
                        <div className="relative">
                            <span
                                className={`hover:bg-[var(--bg-tab)] px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === 'terminal' ? 'bg-[var(--bg-tab)] text-[var(--text-primary)]' : ''}`}
                                onClick={(e) => handleMenuClick('terminal', e)}
                            >
                                Terminal
                            </span>
                            {activeMenu === 'terminal' && (
                                <div className="absolute top-full left-0 w-48 bg-[var(--bg-sidebar)] shadow-2xl border border-[var(--border)] rounded-sm py-1 z-[100] text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-100" onClick={e => e.stopPropagation()}>
                                    <div
                                        className="px-4 py-1.5 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex justify-between"
                                        onClick={() => {
                                            runTerminalCommand(['> New Session Initialized...', '[INFO] Shell active.']);
                                            setActiveMenu(null);
                                        }}
                                    >
                                        <span>New Terminal</span>
                                        <span className="text-[10px] opacity-50">Ctrl+Shift+`</span>
                                    </div>
                                    <div
                                        className="px-4 py-1.5 hover:bg-red-600 hover:text-white cursor-pointer"
                                        onClick={() => {
                                            closeTerminal();
                                            setActiveMenu(null);
                                        }}
                                    >
                                        Kill Terminal
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <span className="hover:bg-[var(--bg-tab)] px-2 py-1 rounded cursor-pointer transition-colors opacity-80 hover:opacity-100" onClick={handleHelp}>Help</span>
                        </div>
                    </div>
                </div>

                {/* Center: Title */}
                <span className="font-bold opacity-70 absolute left-1/2 -translate-x-1/2">Suman Mandal - IDE Portfolio</span>

                {/* Right: Chat Button (NEW) */}
                <div className="flex items-center absolute right-4">
                    <div
                        className={`cursor-pointer p-1.5 rounded transition-colors ${chatOpen ? 'bg-[var(--accent)] text-[var(--bg-main)]' : 'hover:bg-[var(--bg-tab)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        onClick={() => setChatOpen(!chatOpen)}
                        title="AI Chat"
                    >
                        <Icon name="chat" size={16} />
                    </div>
                </div>

            </div>

            {/* Main Workspace Layout - Hidden if minimized */}
            {!isMinimized && (
                <>
                    <div className="flex-1 flex overflow-hidden relative">
                        <ActivityBar app={appContext} />

                        <Sidebar app={appContext} />

                        {/* Resize Handle */}
                        {sidebarOpen && (
                            <div
                                className="w-1 cursor-col-resize bg-transparent hover:bg-[var(--accent)] z-20 transition-colors h-full flex-shrink-0"
                                onMouseDown={startResizing}
                            />
                        )}

                        <Editor app={appContext} />

                        {/* Chat Panel (Right Side) */}
                        {chatOpen && (
                            <>
                                {/* Chat Resize Handle */}
                                <div
                                    className="w-1 cursor-col-resize bg-transparent hover:bg-[var(--accent)] z-20 transition-colors h-full flex-shrink-0"
                                    onMouseDown={startResizingChat}
                                />
                                <ChatPanel app={appContext} />
                            </>
                        )}
                    </div>

                    <StatusBar app={appContext} />

                    {/* Overlays */}
                    <TerminalOverlay app={appContext} />
                </>
            )}

            {/* Minimized Placeholder (Optional visual cue) */}
            {isMinimized && (
                <div className="flex-1 bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-secondary)]">
                    <div className="text-center">
                        <Icon name="files" size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm">Window Minimized</p>
                        <button onClick={() => setIsMinimized(false)} className="mt-4 text-[var(--accent)] hover:underline text-xs">Restore</button>
                    </div>
                </div>
            )}
        </div>
    );
}