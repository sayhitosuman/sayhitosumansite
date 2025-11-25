import React, { useState } from 'react';
import Icon from '../Icon';
import { AppContextType } from '../../types';

const ExtensionsView: React.FC<{ app: AppContextType }> = ({ app }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const socials = [
        {
            name: "LinkedIn",
            id: "linkedin.connect",
            publisher: "Microsoft",
            desc: "Professional networking and career profile.",
            icon: "users",
            url: "https://linkedin.com/in/sayhitosuman"
        },
        {
            name: "GitHub",
            id: "github.code",
            publisher: "GitHub",
            desc: "Source code repository and version control.",
            icon: "git",
            url: "https://github.com/sayhitosuman"
        },
        {
            name: "Kaggle",
            id: "kaggle.data",
            publisher: "Google",
            desc: "Data science competitions and datasets.",
            icon: "database",
            url: "https://kaggle.com/sayhitosuman"
        },
        {
            name: "Twitter / X",
            id: "twitter.social",
            publisher: "X Corp",
            desc: "Tech discussions and updates.",
            icon: "bell",
            url: "https://twitter.com/sayhitosuman"
        },
        {
            name: "Discord",
            id: "discord.community",
            publisher: "Discord Inc",
            desc: "Community chat and collaboration.",
            icon: "comment",
            url: "https://discord.com/users/sayhitosuman"
        },
        {
            name: "HackerRank",
            id: "hackerrank.coding",
            publisher: "HackerRank",
            desc: "Coding challenges and skill certifications.",
            icon: "star",
            url: "https://www.hackerrank.com/profile/sayhitosuman"
        },
        {
            name: "LeetCode",
            id: "leetcode.algorithms",
            publisher: "LeetCode",
            desc: "Algorithm practice and technical interviews.",
            icon: "code",
            url: "https://leetcode.com/u/sayhitosuman/"
        },
        {
            name: "Slack",
            id: "slack.workspace",
            publisher: "Slack Technologies",
            desc: "Team communication and workspace collaboration.",
            icon: "chat",
            url: "https://app.slack.com/client/T09QBD2R151/D09QHR823S6"
        }
    ];

    const handleInstall = (url: string, name: string) => {
        app.runTerminalCommand([
            `> ext install ${name.toLowerCase()} `,
            '[INFO] Resolving package...',
            '[INFO] Verifying authentication...',
            '[SUCCESS] Extension found.',
            `[INFO] Opening ${name} profile...`
        ], url);
    };

    return (
        <div className="flex flex-col h-full anim-fade">
            <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-sidebar)]">
                <h2 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">EXTENSIONS: MARKETPLACE</h2>
                <div className="flex gap-2">
                    <div className="flex-1 bg-[var(--bg-main)] border border-[var(--accent)] p-1 flex items-center">
                        <Icon name="search" size={14} className="ml-2 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search Extensions in Marketplace"
                            className="bg-transparent border-none outline-none text-xs p-2 text-[var(--text-primary)] w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-1 bg-[var(--bg-main)] border border-[var(--accent)] p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p - 2 rounded transition - colors ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'} `}
                            title="Grid View"
                        >
                            <Icon name="extensions" size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p - 2 rounded transition - colors ${viewMode === 'list' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'} `}
                            title="List View"
                        >
                            <Icon name="menu" size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
                        {socials
                            .filter(social => {
                                const query = searchQuery.toLowerCase();
                                return (
                                    social.name.toLowerCase().includes(query) ||
                                    social.desc.toLowerCase().includes(query) ||
                                    social.id.toLowerCase().includes(query) ||
                                    social.publisher.toLowerCase().includes(query)
                                );
                            })
                            .map((social, idx) => (
                                <div key={idx} className="flex flex-col p-4 bg-[var(--bg-sidebar)] hover:bg-[var(--bg-activity)] rounded border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-12 h-12 bg-[var(--bg-activity)] group-hover:bg-[var(--bg-sidebar)] flex items-center justify-center rounded text-[var(--accent)] transition-colors flex-shrink-0">
                                            <Icon name={social.icon as any} size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2 mb-1">
                                                <span className="truncate">{social.name}</span>
                                                <Icon name="check" size={12} className="text-blue-500 flex-shrink-0" />
                                            </h3>
                                            <p className="text-xs text-[var(--text-secondary)] truncate">{social.publisher}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-[var(--text-primary)] opacity-80 mb-3 line-clamp-2 flex-grow">{social.desc}</p>

                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex gap-3 text-[10px] text-[var(--text-secondary)]">
                                            <span className="flex items-center gap-1"><Icon name="play" size={10} /> 1M+</span>
                                            <span className="flex items-center gap-1">★★★★★</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleInstall(social.url, social.name)}
                                        className="w-full bg-[var(--function)] text-white px-3 py-2 text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-transform"
                                    >
                                        Install
                                    </button>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="space-y-4 max-w-5xl mx-auto">
                        {socials
                            .filter(social => {
                                const query = searchQuery.toLowerCase();
                                return (
                                    social.name.toLowerCase().includes(query) ||
                                    social.desc.toLowerCase().includes(query) ||
                                    social.id.toLowerCase().includes(query) ||
                                    social.publisher.toLowerCase().includes(query)
                                );
                            })
                            .map((social, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-[var(--bg-sidebar)] hover:bg-[var(--bg-activity)] rounded border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
                                    <div className="w-12 h-12 bg-[var(--bg-activity)] group-hover:bg-[var(--bg-sidebar)] flex items-center justify-center rounded text-[var(--accent)] transition-colors flex-shrink-0">
                                        <Icon name={social.icon as any} size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                                    {social.name}
                                                    <Icon name="check" size={12} className="text-blue-500" />
                                                </h3>
                                                <p className="text-xs text-[var(--text-secondary)] mb-1">{social.id} <span className="mx-1">•</span> {social.publisher}</p>
                                            </div>
                                            <button
                                                onClick={() => handleInstall(social.url, social.name)}
                                                className="bg-[var(--function)] text-white px-3 py-1 text-xs font-bold rounded hover:opacity-90 active:scale-95 transition-transform"
                                            >
                                                Install
                                            </button>
                                        </div>
                                        <p className="text-sm text-[var(--text-primary)] opacity-80 mb-2">{social.desc}</p>
                                        <div className="flex gap-4 text-[10px] text-[var(--text-secondary)]">
                                            <span className="flex items-center gap-1"><Icon name="play" size={10} /> 1M+</span>
                                            <span className="flex items-center gap-1">★★★★★ 5.0</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExtensionsView;