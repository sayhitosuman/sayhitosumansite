import React from 'react';
import { AppContextType } from '../types';
import { BLOG_POSTS } from '../constants';
import Icon from './Icon';
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import ProjectsView from './views/ProjectsView';
import SkillsView from './views/SkillsView';
import ContactView from './views/ContactView';
import ExtensionsView from './views/ExtensionsView';
import BlogView from './views/BlogView';
import TempFileView from './views/TempFileView';
import ExperienceView from './views/ExperienceView';
import AboutPreview from './views/AboutPreview'; // Import new preview

interface EditorProps {
  app: AppContextType;
}

const Editor: React.FC<EditorProps> = ({ app }) => {
  const activeFile = app.activeFileId ? app.getFileById(app.activeFileId) : null;
  const activeBlogPost = BLOG_POSTS.find(post => post.id === app.activeFileId);

  const renderContent = () => {
    if (app.activeFileId === 'extensions_view') {
      return <ExtensionsView app={app} />;
    }

    if (activeBlogPost) {
      return <BlogView post={activeBlogPost} />;
    }

    if (app.activeFileId?.startsWith('temp_')) {
      return <TempFileView app={app} />;
    }

    switch (app.activeFileId) {
      case 'home': return <HomeView app={app} />;
      case 'about':
        // Split view logic for About Me
        if (app.showPreview) {
          return (
            <div className="flex h-full">
              <div className="flex-1 border-r border-[var(--border)] overflow-y-auto">
                <AboutView app={app} />
              </div>
              {/* Resize Handle */}
              <div
                className="w-1 cursor-col-resize bg-transparent hover:bg-[var(--accent)] z-20 transition-colors h-full flex-shrink-0"
                onMouseDown={app.startResizingPreview}
              />
              <div
                className="overflow-y-auto bg-[var(--bg-main)] scrollbar-thin"
                style={{ width: app.previewWidth }}
              >
                <AboutPreview app={app} />
              </div>
            </div>
          );
        }
        return <AboutView app={app} />;
      case 'projects': return <ProjectsView app={app} />;
      case 'skills': return <SkillsView />;
      case 'contact': return <ContactView />;
      case 'experience': return <ExperienceView app={app} />;
      default:
        return (
          <div className="p-10 text-[var(--text-secondary)] flex flex-col items-center justify-center h-full opacity-50 select-none">
            <Icon name="files" size={80} className="mb-6 opacity-20" />
            <p className="text-xl font-light tracking-widest uppercase mb-2">Suman's IDE</p>
            <p className="text-xs">Select a file to start editing</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-main)] relative overflow-hidden">
      {/* Tabs */}
      <div className="h-9 bg-[var(--bg-tab)] flex overflow-x-auto scrollbar-hide border-b border-[var(--border)]">
        {app.openFiles.map(id => {
          const file = app.getFileById(id);
          const blog = BLOG_POSTS.find(b => b.id === id);
          const isExtension = id === 'extensions_view';

          const name = file ? file.name : (blog ? blog.title : (isExtension ? 'Extensions' : 'Unknown'));

          return (
            <div
              key={id}
              onClick={() => app.setActiveFileId(id)}
              className={`
                        group flex items-center px-3 min-w-[120px] max-w-[200px] border-r border-[var(--border)] cursor-pointer text-xs select-none transition-colors
                        ${app.activeFileId === id ? 'bg-[var(--bg-main)] text-[var(--text-primary)] border-t-2 border-t-[var(--accent)]' : 'bg-[var(--bg-tab)] text-[var(--text-secondary)] border-t-2 border-t-transparent hover:bg-[var(--bg-main)]'}
                    `}
            >
              <span className={`mr-2`}>
                {/* Simple File Icon Logic */}
                {id === 'home' && 'M'}
                {id === 'about' && 'Py'}
                {id === 'projects' && '{ }'}
                {id === 'skills' && '!'}
                {id === 'contact' && 'TS'}
                {id === 'experience' && 'TS'}
                {(id && id.startsWith('temp_')) && '📝'}
                {blog && 'MD'}
                {isExtension && <Icon name="extensions" size={12} />}
              </span>
              <span className="truncate flex-1">{name}</span>
              <span onClick={(e) => app.closeFile(e, id)} className={`ml-2 opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-activity)] rounded-md p-0.5 transition-all ${app.activeFileId === id ? 'opacity-100' : ''}`}>
                <Icon name="x" size={12} />
              </span>
            </div>
          );
        })}
      </div>

      {/* Breadcrumb */}
      {activeFile && (
        <div className="h-6 bg-[var(--bg-main)] flex items-center px-4 text-xs text-[var(--text-secondary)] border-b border-[var(--border)] select-none sticky top-0 z-10">
          suman-mandal <Icon name="chevronRight" size={12} className="mx-1" />
          {activeFile.path.split('/').map((part, index, arr) => (
            <React.Fragment key={part}>
              <span className={index === arr.length - 1 ? 'text-[var(--text-primary)]' : ''}>{part}</span>
              {index < arr.length - 1 && <Icon name="chevronRight" size={12} className="mx-1" />}
            </React.Fragment>
          ))}
          {/* Show Preview Indicator */}
          {app.activeFileId === 'about' && app.showPreview && (
            <>
              <span className="mx-2 opacity-30">|</span>
              <Icon name="play" size={10} className="mr-1 rotate-90" />
              <span className="text-[var(--accent)] font-bold">Preview Mode</span>
            </>
          )}
        </div>
      )}

      {activeBlogPost && (
        <div className="h-6 bg-[var(--bg-main)] flex items-center px-4 text-xs text-[var(--text-secondary)] border-b border-[var(--border)] select-none sticky top-0 z-10">
          blogs <Icon name="chevronRight" size={12} className="mx-1" />
          <span className="text-[var(--text-primary)]">{activeBlogPost.title}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin relative font-mono text-sm md:text-base">
        {renderContent()}
      </div>
    </div>
  );
};

export default Editor;