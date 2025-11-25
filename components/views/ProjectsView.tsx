import React from 'react';
import Icon from '../Icon';
import { AppContextType } from '../../types';

const ProjectsView: React.FC<{ app: AppContextType }> = ({ app }) => {
  const projects = [
    { 
        name: "Brain-Tumor-Segmentation", 
        stack: "PyTorch, U-Net, OpenCV", 
        desc: "Deep learning model achieving 98% accuracy in MRI scan segmentation using modified U-Net architecture.",
        repo: "https://github.com/suman/brain-tumor-seg",
        demo: "https://huggingface.co/spaces/suman/brain-seg"
    },
    { 
        name: "Stock-Price-LSTM", 
        stack: "Python, TensorFlow, Pandas", 
        desc: "Time-series forecasting engine for NSE/BSE stocks using Long Short-Term Memory networks.",
        repo: "https://github.com/suman/stock-lstm",
        demo: null
    },
    { 
        name: "Medical-Chatbot-RAG", 
        stack: "LangChain, Pinecone, Llama-2", 
        desc: "Retrieval-Augmented Generation chatbot specialized in medical diagnosis assistance using reliable datasets.",
        repo: "https://github.com/suman/med-rag",
        demo: "https://med-chat.demo.app"
    },
    { 
        name: "Auto-Resume-Parser", 
        stack: "Spacy, NLP, FastAPI", 
        desc: "API that extracts skills, education, and experience from PDF resumes with high entity recognition rates.",
        repo: "https://github.com/suman/resume-parser",
        demo: null
    }
  ];

  const handleOpenLink = (url: string, type: 'source' | 'demo') => {
      const commands = type === 'source' 
        ? [
            '> git remote -v',
            '> git fetch origin',
            `[INFO] Locating repository at ${url}...`,
            '> git checkout main',
            '[SUCCESS] Repository access granted.',
            '[INFO] Redirecting to GitHub...'
          ]
        : [
            '> npm run build',
            '[INFO] Compiling assets...',
            '[INFO] Optimizing production build...',
            '[SUCCESS] Build complete.',
            `[INFO] Launching live instance at ${url}...`
        ];
      
      app.runTerminalCommand(commands, url);
  };

  return (
    <div className="p-6 md:p-10 anim-fade pb-20 font-mono">
      <div className="mb-6 border-b border-[var(--border)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Projects.json</h2>
          <p className="text-[var(--text-secondary)] text-sm">Loaded 4 projects from local configuration.</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <div key={i} className="group relative bg-[var(--bg-sidebar)] border border-[var(--border)] p-6 rounded-sm hover:border-[var(--accent)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default flex flex-col">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-[var(--accent)]">{p.name}</h3>
                <div className="text-[10px] border border-[var(--border)] px-2 py-1 rounded bg-[var(--bg-main)] text-[var(--text-secondary)]">
                    Public
                </div>
            </div>
            
            <p className="text-xs text-[var(--text-secondary)] mb-4 font-mono">
                <span className="token-keyword">stack:</span> <span className="token-string">"{p.stack}"</span>
            </p>
            
            <p className="text-sm text-[var(--text-primary)] leading-relaxed opacity-90 mb-6 flex-1 border-l-2 border-[var(--border)] pl-3">
              {p.desc}
            </p>
            
            <div className="flex gap-3 mt-auto">
               {p.repo && (
                   <button 
                    onClick={() => handleOpenLink(p.repo!, 'source')}
                    className="flex-1 bg-[var(--bg-activity)] hover:bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-primary)] py-2 text-xs font-bold rounded-sm flex items-center justify-center gap-2 transition-colors active:translate-y-0.5"
                   >
                       <Icon name="git" size={14} /> Source Code
                   </button>
               )}
               {p.demo && (
                   <button 
                    onClick={() => handleOpenLink(p.demo!, 'demo')}
                    className="flex-1 bg-[var(--function)] text-[var(--bg-main)] hover:opacity-90 py-2 text-xs font-bold rounded-sm flex items-center justify-center gap-2 transition-all active:translate-y-0.5 shadow-lg"
                   >
                       <Icon name="play" size={14} /> Live View
                   </button>
               )}
               {!p.demo && (
                   <button disabled className="flex-1 border border-[var(--border)] text-[var(--text-secondary)] py-2 text-xs font-bold rounded-sm cursor-not-allowed opacity-50 bg-[var(--bg-main)]">
                       Local Only
                   </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;