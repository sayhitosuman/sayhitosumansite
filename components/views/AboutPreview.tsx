import React from 'react';
import { AppContextType } from '../../types';
import Icon from '../Icon';

const AboutPreview: React.FC<{ app: AppContextType }> = ({ app }) => {
    return (
        <div className="p-8 h-full overflow-y-auto bg-[var(--bg-main)] font-sans text-[var(--text-primary)] scrollbar-thin">
            <h1 className="text-3xl font-bold mb-6 border-b border-[var(--border)] pb-4">About Me</h1>

            <div className="mb-8">
                <p className="text-lg leading-relaxed opacity-90 mb-4">
                    "Undergraduate at <span className="font-bold text-[var(--accent)]">IIT Madras</span> specialized in Data Science.
                    Building the bridge between theoretical AI and production systems."
                </p>
                <div className="flex gap-4 text-sm text-[var(--text-secondary)]">
                    <span>📍 India</span>
                    <span>🟢 Open to Opportunities</span>
                </div>
            </div>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--accent)]">
                    <Icon name="play" size={16} /> Education
                </h2>
                <div className="bg-[var(--bg-sidebar)] p-4 rounded border border-[var(--border)]">
                    <h3 className="font-bold text-lg">BS in Data Science & Applications</h3>
                    <p className="opacity-80">Indian Institute of Technology, Madras</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">2026 - 2030 (Expected)</p>
                    <div className="mt-2 flex gap-2">
                        <span className="text-xs bg-[var(--bg-activity)] px-2 py-1 rounded">Deep Learning</span>
                        <span className="text-xs bg-[var(--bg-activity)] px-2 py-1 rounded">Big Data</span>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--accent)]">
                    <Icon name="terminal" size={16} /> Experience
                </h2>

                <div className="mb-4">
                    <h3 className="font-bold">Student Researcher</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Neural Networks / NLP</p>
                    <p className="mt-1 opacity-80 text-sm">Researching architecture optimization for Low-Resource LLMs.</p>
                </div>

                <div>
                    <h3 className="font-bold">Open Source Contributor</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Python / AI Tools</p>
                    <p className="mt-1 opacity-80 text-sm">Contributed to libraries like LangChain and HuggingFace Transformers.</p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--accent)]">
                    <Icon name="settings" size={16} /> Skills
                </h2>
                <p className="opacity-80 mb-2">View full visualization in <span className="text-[var(--accent)] cursor-pointer hover:underline" onClick={() => app.openFile('skills')}>skills.yaml</span></p>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-[var(--bg-activity)] px-3 py-1 rounded text-sm border border-[var(--border)]">Python</span>
                    <span className="bg-[var(--bg-activity)] px-3 py-1 rounded text-sm border border-[var(--border)]">PyTorch</span>
                    <span className="bg-[var(--bg-activity)] px-3 py-1 rounded text-sm border border-[var(--border)]">SQL</span>
                    <span className="bg-[var(--bg-activity)] px-3 py-1 rounded text-sm border border-[var(--border)]">React</span>
                </div>
            </section>
        </div>
    );
};

export default AboutPreview;