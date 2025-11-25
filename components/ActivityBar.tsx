
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { AppContextType } from '../types';

interface ActivityBarProps {
  app: AppContextType;
}

const ActivityBar: React.FC<ActivityBarProps> = ({ app }) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const handleIconClick = (iconName: string) => {
    if (app.activeSideBarIcon === iconName) {
      // If clicking the active icon, toggle visibility
      app.setSidebarOpen(!app.sidebarOpen);
    } else {
      // If clicking a different icon, switch to it and ensure sidebar is open
      app.setActiveSideBarIcon(iconName);
      if (!app.sidebarOpen) {
        app.setSidebarOpen(true);
      }
    }
  };

  const handlePopupClick = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setActivePopup(activePopup === name ? null : name);
  };

  useEffect(() => {
    const handleClickOutside = () => setActivePopup(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (iconName: string) => app.activeSideBarIcon === iconName && app.sidebarOpen;

  return (
    <div className="w-12 flex flex-col items-center py-4 bg-[var(--bg-activity)] border-r border-[var(--border)] z-20 flex-shrink-0 justify-between select-none">
      <div className="flex flex-col gap-6">
        <div 
          className={`cursor-pointer p-2 rounded transition-colors relative ${isActive('files') ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
          onClick={() => handleIconClick('files')}
          title="Explorer (Ctrl+Shift+E)"
        >
          <Icon name="files" size={24} className={isActive('files') ? "text-[var(--text-primary)]" : ""} />
          {isActive('files') && <div className="w-0.5 h-6 bg-[var(--text-primary)] absolute left-0 top-2"></div>}
        </div>
        
        <div 
          className={`cursor-pointer p-2 rounded transition-colors relative ${isActive('search') ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
          onClick={() => handleIconClick('search')}
          title="Search / Blogs"
        >
          <Icon name="search" size={24} className={isActive('search') ? "text-[var(--text-primary)]" : ""} />
          {isActive('search') && <div className="w-0.5 h-6 bg-[var(--text-primary)] absolute left-0 top-2"></div>}
        </div>
        
        <div 
          className={`cursor-pointer p-2 rounded transition-colors relative ${isActive('extensions') ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
          onClick={() => handleIconClick('extensions')}
          title="Extensions / Socials"
        >
          <Icon name="extensions" size={24} className={isActive('extensions') ? "text-[var(--text-primary)]" : ""} />
           {isActive('extensions') && <div className="w-0.5 h-6 bg-[var(--text-primary)] absolute left-0 top-2"></div>}
        </div>
      </div>
      
      <div className="flex flex-col gap-6 relative">
        {/* 1. Theme Toggle (Top of bottom cluster) */}
        <div 
            className="cursor-pointer p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" 
            onClick={() => app.setTheme(app.theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${app.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <Icon name={app.theme === 'dark' ? 'sun' : 'moon'} size={24} />
        </div>

        {/* 2. Profile (Middle of bottom cluster) */}
        <div className="relative">
            <div 
                className="cursor-pointer p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" 
                title="Profile"
                onClick={(e) => handlePopupClick(e, 'profile')}
            >
                <Icon name="account" size={24} className={activePopup === 'profile' ? "text-[var(--text-primary)]" : ""} />
            </div>
            {/* Profile Popup Menu */}
            {activePopup === 'profile' && (
                <div 
                    className="absolute left-12 bottom-0 mb-2 w-48 bg-[#252526] shadow-xl border border-[var(--border)] rounded-sm text-[var(--text-primary)] z-[100] text-xs animate-in fade-in slide-in-from-left-2 duration-100 overflow-hidden"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div 
                        className="px-4 py-2 hover:bg-[var(--accent)] hover:text-white cursor-pointer transition-colors"
                        onClick={(e) => { 
                            e.stopPropagation();
                            app.openFile('about'); 
                            setActivePopup(null); 
                        }}
                    >
                        Coder Profile
                    </div>
                    <div 
                        className="px-4 py-2 hover:bg-[var(--accent)] hover:text-white cursor-pointer transition-colors"
                        onClick={(e) => { 
                            e.stopPropagation();
                            window.open('https://youtube.com', '_blank'); 
                            setActivePopup(null); 
                        }}
                    >
                        Personal Profile
                    </div>
                </div>
            )}
        </div>

        {/* 3. Settings (Bottom of bottom cluster) */}
        <div className="relative">
            <div 
                className="cursor-pointer p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" 
                title="Settings"
                onClick={(e) => handlePopupClick(e, 'settings')}
            >
                <Icon name="settings" size={24} className={activePopup === 'settings' ? "text-[var(--text-primary)]" : ""} />
            </div>
             {/* Settings Popup Menu */}
             {activePopup === 'settings' && (
                <div 
                    className="absolute left-12 bottom-0 w-56 bg-[#252526] shadow-xl border border-[var(--border)] rounded-sm text-[var(--text-primary)] z-[100] text-xs animate-in fade-in slide-in-from-left-2 duration-100 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-4 py-2 text-[var(--text-secondary)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--border)]">
                        Window Zoom ({Math.round(app.zoomLevel * 100)}%)
                    </div>
                     <div 
                        className="px-4 py-2 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex justify-between transition-colors"
                        onClick={(e) => { e.stopPropagation(); app.setZoomLevel(Math.min(app.zoomLevel + 0.1, 2.0)); }}
                    >
                        <span>Zoom In</span>
                        <span className="opacity-50">Ctrl +</span>
                    </div>
                    <div 
                        className="px-4 py-2 hover:bg-[var(--accent)] hover:text-white cursor-pointer flex justify-between transition-colors"
                        onClick={(e) => { e.stopPropagation(); app.setZoomLevel(Math.max(app.zoomLevel - 0.1, 0.5)); }}
                    >
                        <span>Zoom Out</span>
                        <span className="opacity-50">Ctrl -</span>
                    </div>
                    <div 
                        className="px-4 py-2 hover:bg-[var(--accent)] hover:text-white cursor-pointer transition-colors"
                        onClick={(e) => { e.stopPropagation(); app.setZoomLevel(1); }}
                    >
                        Reset Zoom
                    </div>
                    <div className="my-1 border-b border-[var(--border)] opacity-20"></div>
                     <div 
                        className="px-4 py-2 hover:bg-[var(--accent)] hover:text-white cursor-pointer transition-colors"
                        onClick={(e) => { 
                            e.stopPropagation();
                            app.setTheme(app.theme === 'dark' ? 'light' : 'dark'); 
                            setActivePopup(null); 
                        }}
                    >
                        Color Theme: {app.theme === 'dark' ? 'Dark' : 'Light'}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ActivityBar;