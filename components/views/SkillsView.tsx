import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'React', level: 95 },
  { name: 'TS', level: 90 },
  { name: 'Node', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'SQL', level: 75 },
  { name: 'AWS', level: 70 },
  { name: 'UI/UX', level: 85 },
];

const SkillsView = () => {
  return (
    <div className="p-6 md:p-10 h-full flex flex-col anim-fade">
      <div className="mb-8">
        <span className="token-comment"># skills.yaml config</span><br/>
        <span className="token-keyword">visualize</span>: <span className="token-string">true</span>
      </div>

      <div className="flex-1 min-h-[400px] w-full max-w-4xl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'monospace' }} 
                width={60}
                axisLine={false}
                tickLine={false}
            />
            <Tooltip 
                cursor={{ fill: 'var(--bg-activity)', opacity: 0.5 }}
                contentStyle={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--accent)' }}
            />
            <Bar dataKey="level" barSize={20} radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--accent)' : 'var(--accent-secondary)'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 p-4 bg-[var(--bg-activity)] border-l-4 border-[var(--function)] text-xs text-[var(--text-secondary)] font-mono">
          [INFO] Skills data loaded from local cache.<br/>
          [INFO] Proficiency metrics updated: Today.
      </div>
    </div>
  );
};

export default SkillsView;