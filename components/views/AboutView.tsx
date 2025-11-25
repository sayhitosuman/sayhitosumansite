import React from 'react';
import { AppContextType } from '../../types';
import Icon from '../Icon';

const AboutView: React.FC<{ app: AppContextType }> = ({ app }) => {

    const handleDownloadCV = () => {
        app.runTerminalCommand([
            '> wget https://raw.githubusercontent.com/sayhitosuman/assets/main/Resume%20(1).pdf',
            '[INFO] Resolving host...',
            '[INFO] Connecting to database...',
            '[INFO] Stream detected (PDF/142KB)...',
            '[SUCCESS] Suman_Mandal_Resume.pdf saved to /local/downloads.'
        ]);

        // Download the actual PDF from GitHub
        setTimeout(() => {
            const a = document.createElement('a');
            a.href = 'https://raw.githubusercontent.com/sayhitosuman/assets/main/Resume%20(1).pdf';
            a.download = 'Suman_Mandal_Resume.pdf';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 2500);
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl anim-fade flex flex-col h-full overflow-y-auto scrollbar-thin">

            {/* Suggestion Banner */}
            {!app.showPreview && (
                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 p-3 rounded mb-6 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Icon name="info" size={14} />
                        <span><strong>Tip:</strong> Click <strong>View &gt; Toggle Side Preview</strong> to see a readable version of this profile.</span>
                    </span>
                    <span className="cursor-pointer hover:text-white" onClick={() => app.setShowPreview(true)}>Open Preview Now</span>
                </div>
            )}

            <div className="mb-6">
                <span className="token-comment">"""<br />About Configuration Module<br />Detailed professional breakdown and background history.<br />"""</span>
            </div>

            <div className="space-y-6 text-[var(--text-primary)] leading-relaxed flex-1 font-mono text-sm md:text-base">

                {/* Imports */}
                <div>
                    <span className="token-keyword">import</span> <span className="token-string">Torch</span>, <span className="token-string">TensorFlow</span><br />
                    <span className="token-keyword">from</span> <span className="token-string">Life</span> <span className="token-keyword">import</span> <span className="token-function">Passion</span>
                </div>

                {/* Class Definition */}
                <div className="mt-4">
                    <span className="token-keyword">class</span> <span className="token-function">SumanMandal</span>(<span className="token-function">DataScientist</span>):
                </div>

                {/* Init / Summary */}
                <div className="pl-4 md:pl-8 border-l border-[var(--border)] ml-1 md:ml-2">
                    <span className="token-keyword">def</span> <span className="token-function">__init__</span>(<span className="token-keyword">self</span>):
                    <div className="pl-8 text-[var(--string)]">
                        <span className="token-comment"># Driven by data, inspired by intelligence.</span><br />
                        "Undergraduate at <span className="text-[var(--accent)] font-bold">IIT Madras</span> specialized in Data Science.<br />
                        Building the bridge between theoretical AI and production systems."
                    </div>
                    <div className="pl-8 mt-2">
                        <span className="token-keyword">self</span>.status = <span className="token-string">"Open to Opportunities"</span><br />
                        <span className="token-keyword">self</span>.location = <span className="token-string">"India"</span>
                    </div>
                </div>

                {/* Education Section */}
                <div className="pl-4 md:pl-8 border-l border-[var(--border)] ml-1 md:ml-2">
                    <span className="token-keyword">def</span> <span className="token-function">get_education</span>(<span className="token-keyword">self</span>):
                    <div className="pl-8">
                        <span className="token-keyword">return</span> [
                        <div className="pl-4">
                            {'{'}
                            <div className="pl-4">
                                <span className="token-keyword">"degree"</span>: <span className="token-string">"BS in Data Science & Applications"</span>,<br />
                                <span className="token-keyword">"institution"</span>: <span className="token-string">"Indian Institute of Technology, Madras"</span>,<br />
                                <span className="token-keyword">"year"</span>: <span className="token-string">"2026 - 2030 (Expected)"</span>,<br />
                                <span className="token-keyword">"focus"</span>: [<span className="token-string">"Deep Learning"</span>, <span className="token-string">"Big Data"</span>]
                            </div>
                            {'}'},
                        </div>
                        ]
                    </div>
                </div>

                {/* Experience Section */}
                <div className="pl-4 md:pl-8 border-l border-[var(--border)] ml-1 md:ml-2">
                    <span className="token-keyword">def</span> <span className="token-function">get_experience</span>(<span className="token-keyword">self</span>):
                    <div className="pl-8">
                        <span className="token-keyword">return</span> [
                        <div className="pl-4">
                            {'{'}
                            <div className="pl-4">
                                <span className="token-keyword">"role"</span>: <span className="token-string">"Student Researcher"</span>,<br />
                                <span className="token-keyword">"domain"</span>: <span className="token-string">"Neural Networks / NLP"</span>,<br />
                                <span className="token-keyword">"description"</span>: <span className="token-string">"Researching architecture optimization for Low-Resource LLMs."</span>
                            </div>
                            {'}'},
                            <div className="mt-2">
                                {'{'}
                                <div className="pl-4">
                                    <span className="token-keyword">"role"</span>: <span className="token-string">"Open Source Contributor"</span>,<br />
                                    <span className="token-keyword">"domain"</span>: <span className="token-string">"Python / AI Tools"</span>,<br />
                                    <span className="token-keyword">"description"</span>: <span className="token-string">"Contributed to libraries like LangChain and HuggingFace Transformers."</span>
                                </div>
                                {'}'}
                            </div>
                        </div>
                        ]
                    </div>
                </div>

                {/* Skills Integration */}
                <div className="pl-4 md:pl-8 border-l border-[var(--border)] ml-1 md:ml-2">
                    <span className="token-keyword">def</span> <span className="token-function">get_skills</span>(<span className="token-keyword">self</span>):
                    <div className="pl-8">
                        <span className="token-keyword">return</span> <span className="token-function">load_yaml</span>(
                        <span
                            className="token-string cursor-pointer hover:underline text-[var(--accent)] font-bold"
                            onClick={() => app.openFile('skills')}
                            title="Open skills.yaml"
                        >
                            'config/skills.yaml'
                        </span>
                        )
                    </div>
                </div>

                {/* Download CV Action */}
                <div className="pl-4 md:pl-8 border-l border-[var(--border)] ml-1 md:ml-2">
                    <div className="mt-4 group inline-block">
                        <span className="token-comment"># Execute download protocol</span><br />
                        <button
                            onClick={handleDownloadCV}
                            className="flex items-center gap-2 hover:bg-[var(--bg-activity)] p-1 -ml-1 rounded transition-colors"
                        >
                            <span className="token-function font-bold">self.download_resume</span>(
                            <span className="token-keyword">format</span>=<span className="token-string">"pdf"</span>
                            )
                            <Icon name="play" size={12} className="text-[var(--accent)] animate-pulse" />
                        </button>
                    </div>
                </div>

            </div>

            <div className="mt-10 border-t border-[var(--border)] pt-6">
                <p className="text-[var(--text-secondary)] text-xs mb-2 token-comment"># Ready to collaborate? Initialize handshake.</p>
                <button
                    onClick={() => app.openFile('contact')}
                    className="group flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                    <span className="bg-[var(--bg-activity)] p-2 rounded group-hover:bg-[var(--bg-main)] border border-[var(--border)]">
                        <Icon name="terminal" size={16} />
                    </span>
                    <div className="flex flex-col text-left">
                        <span className="text-xs font-bold uppercase tracking-wider">Execute Contact Protocol</span>
                        <span className="text-[10px] font-mono">./run contact.tsx</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default AboutView;