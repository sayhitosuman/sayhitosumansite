import React from 'react';
import { BlogPost } from '../../types';
import Icon from '../Icon';

const BlogView: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto anim-fade font-sans">
        <div className="mb-6 border-b border-[var(--border)] pb-4">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><Icon name="play" size={12}/> Suman Mandal</span>
                <span>•</span>
                <span>{post.date}</span>
            </div>
        </div>
        <div className="prose prose-invert max-w-none whitespace-pre-wrap text-[var(--text-primary)] leading-relaxed opacity-90">
            {post.content.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line}</p>
            ))}
        </div>
    </div>
  );
};

export default BlogView;