
import React from 'react';
import Icon from '../Icon';
import { AppContextType } from '../../types';

const ExperienceView: React.FC<{ app: AppContextType }> = ({ app }) => {
  const experiences = [
    {
      id: 1,
      role: "Open source contribution",
      company: "community",
      date: "2025- Present",
      description: "Actively contributing to various open-source AI repositories.",
      stack: ["python", "jax", "keras"],
      type: "Part-time",
      category: "community"
    }
  ];

  const handleDownload = () => {
    app.runTerminalCommand([
      '> curl -O https://raw.githubusercontent.com/sayhitosuman/assets/main/Resume%20(1).pdf',
      '[INFO] Handshake successful...',
      '[INFO] Downloading PDF (142KB)...',
      '#################################### 100%',
      '[SUCCESS] Saved to /local/downloads/Suman_Mandal_Resume.pdf'
    ]);

    // Download the actual PDF from GitHub
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = 'https://raw.githubusercontent.com/sayhitosuman/assets/main/Resume%20(1).pdf';
      link.download = 'Suman_Mandal_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl anim-fade h-full overflow-y-auto scrollbar-thin">
      <div className="mb-8 border-b border-[var(--border)] pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Icon name="terminal" size={20} className="text-[var(--accent)]" />
              experience.tsx
            </h2>
            <p className="text-[var(--text-secondary)] text-xs mt-1 font-mono">
              <span className="token-keyword">const</span> <span className="token-function">EXPERIENCE_DATA</span> = <span className="token-keyword">await</span> <span className="token-function">fetchHistory</span>();
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-[var(--function)] text-white px-4 py-1.5 rounded-sm text-xs font-bold hover:opacity-90 transition-transform active:scale-95 shadow-md"
            >
              <Icon name="play" size={12} /> Download Resume
            </button>
            <div className="text-[var(--text-secondary)] text-xs border border-[var(--border)] px-2 py-1.5 rounded bg-[var(--bg-sidebar)]">
              <span className="token-number">{experiences.length}</span> Records
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="group bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-sm p-5 hover:border-[var(--accent)] transition-all duration-200 hover:shadow-md relative overflow-hidden">

            {/* Decoration Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${exp.category === 'achievement' ? 'bg-[var(--function)]' : 'bg-[var(--accent)]'} group-hover:w-1.5 transition-all`}></div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2 pl-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{exp.role}</h3>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm border ${exp.type === 'Research' ? 'border-purple-500/50 text-purple-500 bg-purple-500/10' :
                    exp.type === 'Internship' ? 'border-blue-500/50 text-blue-500 bg-blue-500/10' :
                      exp.type === 'Part-time' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                        'border-green-500/50 text-green-500 bg-green-500/10'
                    }`}>
                    {exp.type}
                  </span>
                </div>
                <div className="text-sm text-[var(--text-secondary)] font-mono mt-1">
                  <span className="text-[var(--accent-secondary)]">@ {exp.company}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-activity)] px-3 py-1 rounded-full border border-[var(--border)]">
                <Icon name="play" size={10} />
                {exp.date}
              </div>
            </div>

            <div className="pl-3">
              <p className="text-sm text-[var(--text-primary)] opacity-90 mb-4 leading-relaxed font-sans border-l-2 border-[var(--border)] pl-4">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-[var(--text-secondary)] font-mono mr-1">stack:</span>
                {exp.stack.map((tech, i) => (
                  <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/50 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}

        {/* End of List Indicator */}
        <div className="flex items-center gap-2 opacity-50 justify-center mt-4">
          <div className="h-[1px] w-12 bg-[var(--border)]"></div>
          <span className="text-[10px] text-[var(--text-secondary)] font-mono">EOF</span>
          <div className="h-[1px] w-12 bg-[var(--border)]"></div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceView;
