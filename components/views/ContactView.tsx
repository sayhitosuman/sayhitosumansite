import React, { useState } from 'react';
import Icon from '../Icon';

const ContactView = () => {
  const [formState, setFormState] = useState({ email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[500px] anim-fade">
      <div className="w-full max-w-md bg-[var(--bg-sidebar)] border border-[var(--border)] shadow-2xl rounded-lg overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[var(--bg-activity)] px-4 py-2 border-b border-[var(--border)] flex items-center justify-between select-none">
          <span className="text-xs font-bold flex items-center gap-2"><Icon name="terminal" size={12} /> contact.tsx — bash</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
        </div>

        <div className="p-6 space-y-4 font-mono text-sm relative">
          {sent ? (
            <div className="absolute inset-0 bg-[var(--bg-sidebar)] flex flex-col items-center justify-center text-[var(--accent)] z-10 anim-fade">
              <Icon name="check" size={48} className="mb-2" />
              <p>Message Sent!</p>
            </div>
          ) : null}

          <div className="text-[var(--text-secondary)]">
            <span className="text-[var(--accent)]">user@portfolio:~$</span> ./send_message --priority high
          </div>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1">Email</label>
              <input
                required
                type="email"
                value={formState.email}
                onChange={e => setFormState({ ...formState, email: e.target.value })}
                placeholder="enter_your_email@domain.com"
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] p-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none rounded-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1">Message Payload</label>
              <textarea
                required
                rows={4}
                value={formState.message}
                onChange={e => setFormState({ ...formState, message: e.target.value })}
                placeholder="// Type your message here..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border)] p-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none rounded-sm transition-colors font-mono"
              ></textarea>
            </div>
            <button className="w-full bg-[var(--function)] text-[var(--bg-main)] py-2 text-sm font-bold hover:opacity-90 transition-all rounded-sm flex items-center justify-center gap-2 mt-2">
              EXECUTE <Icon name="chevronRight" size={14} />
            </button>
          </form>

          <div className="pt-4 border-t border-[var(--border)] flex justify-between px-4">
            <a href="mailto:sayhitosuman@outlook.com" className="text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center text-xs gap-1 transition-colors">
              <Icon name="git" size={14} /> email
            </a>
            <a href="https://www.linkedin.com/in/sayhitosuman" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center text-xs gap-1 transition-colors">
              <Icon name="link" size={14} /> LinkedIn
            </a>
            <a href="https://discord.com/users/1435629720531239024" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center text-xs gap-1 transition-colors">
              <Icon name="search" size={14} /> Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;