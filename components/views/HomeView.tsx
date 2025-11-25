
import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import { AppContextType } from '../../types';

const HomeView: React.FC<{ app: AppContextType }> = ({ app }) => {
  // Logic to switch images based on theme
  const lightProfile = "https://raw.githubusercontent.com/sayhitosuman/assets/main/unnamed.jpg"; 
  const darkProfile = "https://raw.githubusercontent.com/sayhitosuman/assets/main/b093c4b7-c7a0-47e9-82da-ead318435afa.jpg";
  
  // Fallbacks in case files are missing (Visual placeholder matching description)
  const fallbackLight = "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&glassesProbability=100"; 
  const fallbackDark = "https://api.dicebear.com/9.x/notionists/svg?seed=Felix&glassesProbability=100&backgroundColor=b6e3f4";

  const [imgSrc, setImgSrc] = useState(app.theme === 'dark' ? darkProfile : lightProfile);

  useEffect(() => {
    setImgSrc(app.theme === 'dark' ? darkProfile : lightProfile);
  }, [app.theme]);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = app.theme === 'dark' ? fallbackDark : fallbackLight;
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl anim-fade relative font-sans">
      {/* Markdown Preview Header Style */}
      <div className="border-b border-[var(--border)] pb-8 mb-8 flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-8">
        
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[var(--text-primary)] border-l-4 border-[var(--accent)] pl-4">
            Hi, I'm Suman Mandal <span className="text-[var(--accent)]">👋</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-[var(--text-secondary)] font-light mb-4">
            Data Scientist & AI/ML Engineer
          </h2>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Icon name="git" size={14} /> <span>IIT Madras (BS Data Science)</span>
          </div>
        </div>

        {/* Image Section - Optimized: Rectangle with L-Shape Sticks */}
        <div className="relative group p-2">
           {/* L-Shape Sticks */}
           {/* Perpendicular (Left) */}
           <div className="absolute left-0 bottom-0 w-1.5 h-[80%] bg-[var(--accent)] transition-all duration-500 group-hover:h-full"></div> 
           {/* Base (Bottom) */}
           <div className="absolute left-0 bottom-0 h-1.5 w-[80%] bg-[var(--accent)] transition-all duration-500 group-hover:w-full"></div> 

          <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden ml-3 mb-3 shadow-lg">
              <img 
                  src={imgSrc} 
                  onError={handleImgError}
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
          </div>
        </div>

      </div>

      {/* Markdown Content Area */}
      <div className="prose prose-invert max-w-none text-[var(--text-primary)]">
          <blockquote>
              <p className="text-lg italic text-[var(--text-secondary)] border-l-4 border-[var(--accent)] pl-4">
                  "Transforming raw data into actionable intelligence through Scalable AI."
              </p>
          </blockquote>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                  <h3 className="text-xl font-bold mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                      <Icon name="settings" size={20}/> Tech Stack
                  </h3>
                  <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>Languages:</strong> Python, SQL, C++, JavaScript</li>
                      <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> <strong>Frameworks:</strong> PyTorch, TensorFlow, Scikit-learn</li>
                      <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> <strong>Tools:</strong> Docker, Kubernetes, AWS, Git</li>
                  </ul>
              </div>
              
              <div>
                  <h3 className="text-xl font-bold mb-4 border-b border-[var(--border)] pb-2 flex items-center gap-2">
                       <Icon name="search" size={20}/> Focus Areas
                  </h3>
                   <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-[var(--accent)]"/> Computer Vision</li>
                      <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-[var(--accent)]"/> Natural Language Processing (LLMs)</li>
                      <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-[var(--accent)]"/> Predictive Analytics</li>
                  </ul>
              </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
              <button 
                  onClick={() => app.openFile('projects')}
                  className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-[var(--bg-main)] px-6 py-2 rounded-sm font-bold text-sm flex items-center gap-2 transition-transform active:scale-95"
              >
                  View Projects
              </button>
              <button 
                   onClick={() => app.openFile('about')}
                  className="bg-[var(--bg-activity)] hover:bg-[var(--bg-tab)] border border-[var(--border)] text-[var(--text-primary)] px-6 py-2 rounded-sm font-bold text-sm flex items-center gap-2 transition-transform active:scale-95"
              >
                  Read About Me
              </button>
          </div>
      </div>
    </div>
  );
};

export default HomeView;
