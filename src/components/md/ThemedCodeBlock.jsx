import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ThemedCodeBlock = ({ language, value }) => {
    // Custom theme variables to match the cyberpunk aesthetic
    const customStyle = {
        ...atomDark,
        'pre[class*="language-"]': {
            ...atomDark['pre[class*="language-"]'],
            background: 'rgb(15 23 42 / 0.5)', // slate-950/50
            border: '1px solid rgb(30 41 59 / 0.5)', // slate-800/50
            borderRadius: '0.75rem',
            padding: '1.5rem',
            margin: '1.5rem 0',
        },
        'code[class*="language-"]': {
            ...atomDark['code[class*="language-"]'],
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.875rem',
            lineHeight: '1.5',
        },
        // Customize highlighting colors for a more neon feel
        'keyword': { color: '#22d3ee' }, // cyan-400
        'string': { color: '#10b981' }, // emerald-500
        'comment': { color: '#64748b' }, // slate-500
        'function': { color: '#818cf8' }, // indigo-400
        'number': { color: '#fbbf24' }, // amber-400
    };

    return (
        <div className="relative group">
            <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity select-none">
                {language || 'code'}
            </div>
            <SyntaxHighlighter
                language={language || 'text'}
                style={customStyle}
                PreTag="div"
                showLineNumbers={true}
                lineNumberStyle={{ minWidth: '2.5rem', pr: '1rem', borderRight: '1px solid #334155', marginRight: '1rem', opacity: '0.2' }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export default ThemedCodeBlock;
