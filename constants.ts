import { FileNode, FolderNode, BlogPost } from './types';

export const FILE_SYSTEM: FolderNode[] = [
  {
    id: 'portfolio',
    name: 'suman-mandal',
    files: [
      { id: 'home', name: 'README.md', type: 'md', path: 'suman-mandal/README.md' },
    ],
    folders: [
      {
        id: 'src',
        name: 'src',
        files: [
          { id: 'about', name: 'about_me.py', type: 'py', path: 'src/about_me.py' },
          { id: 'experience', name: 'experience.tsx', type: 'tsx', path: 'src/experience.tsx' },
          { id: 'contact', name: 'contact.tsx', type: 'tsx', path: 'src/contact.tsx' },
        ]
      },
      {
        id: 'models',
        name: 'models',
        files: [
          { id: 'projects', name: 'projects.json', type: 'json', path: 'models/projects.json' },
        ]
      },
      {
        id: 'config',
        name: 'config',
        files: [
          { id: 'skills', name: 'skills.yaml', type: 'yaml', path: 'config/skills.yaml' },
        ]
      }
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog1',
    title: 'Understanding Transformers',
    date: '2024-03-10',
    summary: 'A deep dive into the architecture that changed NLP forever.',
    content: "# Understanding Transformers\n\nThe Transformer architecture, introduced in the paper 'Attention Is All You Need', has revolutionized natural language processing..."
  },
  {
    id: 'blog2',
    title: 'Optimizing Neural Networks',
    date: '2024-02-15',
    summary: 'Techniques for faster convergence and better generalization.',
    content: "# Optimizing Neural Networks\n\nOptimization is at the heart of Deep Learning. From SGD to AdamW, picking the right optimizer is crucial..."
  },
  {
    id: 'blog3',
    title: 'My Journey at IITM',
    date: '2024-01-20',
    summary: 'Reflecting on my experience in the BS Data Science program.',
    content: "# My Journey at IITM\n\nThe BS in Data Science and Applications at IIT Madras is rigorous, challenging, and incredibly rewarding..."
  }
];

export const THEMES = {
  dark: `
    --bg-main: #1e1e1e;
    --bg-sidebar: #252526;
    --bg-activity: #333333;
    --bg-tab: #2d2d2d;
    --bg-tab-active: #1e1e1e;
    --text-primary: #d4d4d4;
    --text-secondary: #858585;
    --border: #3e3e42;
    --accent: #4ec9b0; 
    --accent-secondary: #ce9178;
    --keyword: #569cd6;
    --function: #dcdcaa;
    --number: #b5cea8;
    --string: #ce9178;
    --comment: #6a9955;
    --selection: #264f78;
    --scrollbar: #424242;
    --terminal-bg: #0c0c0c;
    --terminal-text: #cccccc;
  `,
  light: `
    --bg-main: #ffffff;
    --bg-sidebar: #f3f3f3;
    --bg-activity: #e8e8e8;
    --bg-tab: #ececec;
    --bg-tab-active: #ffffff;
    --text-primary: #24292e;
    --text-secondary: #6a737d;
    --border: #e1e4e8;
    --accent: #005cc5;
    --accent-secondary: #d73a49;
    --keyword: #d73a49;
    --function: #6f42c1;
    --number: #005cc5;
    --string: #032f62;
    --comment: #6a737d;
    --selection: #c8c8fa;
    --scrollbar: #d1d5da;
    --terminal-bg: #1e1e1e;
    --terminal-text: #f0f0f0;
  `
};

export const GLOBAL_CSS = `
  .code-line { counter-increment: line; display: flex; gap: 1.5rem; }
  .code-line::before { content: counter(line); color: var(--text-secondary); min-width: 1.5rem; text-align: right; opacity: 0.5; font-size: 0.8rem; user-select: none; }
  
  .token-keyword { color: var(--keyword); }
  .token-function { color: var(--function); }
  .token-string { color: var(--string); }
  .token-number { color: var(--number); }
  .token-comment { color: var(--comment); font-style: italic; }
  
  .anim-fade { animation: fadeIn 0.3s ease-out forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  .terminal-cursor::after {
    content: '▋';
    animation: blink 1s step-end infinite;
    color: var(--accent);
  }
  @keyframes blink { 50% { opacity: 0; } }

  .loader-bar {
    height: 4px;
    background: var(--bg-activity);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  .loader-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30%;
    background: var(--accent);
    animation: loading 1.5s infinite ease-in-out;
  }
  @keyframes loading {
    0% { left: -30%; }
    100% { left: 100%; }
  }
`;