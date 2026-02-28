import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, AlertCircle } from 'lucide-react';

const DiffCheck = () => {
    const [original, setOriginal] = useState('');
    const [modified, setModified] = useState('');
    const [diff, setDiff] = useState([]);
    const [copied, setCopied] = useState(false);

    // Simple line-based diff algorithm since jsdiff installation was unstable
    const computeDiff = (text1, text2) => {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const result = [];

        let i = 0, j = 0;
        while (i < lines1.length || j < lines2.length) {
            if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
                result.push({ type: 'normal', value: lines1[i] });
                i++; j++;
            } else if (i < lines1.length && (j >= lines2.length || !lines2.slice(j).includes(lines1[i]))) {
                result.push({ type: 'removed', value: lines1[i] });
                i++;
            } else if (j < lines2.length) {
                result.push({ type: 'added', value: lines2[j] });
                j++;
            }
        }
        return result;
    };

    useEffect(() => {
        setDiff(computeDiff(original, modified));
    }, [original, modified]);

    const handleCopy = () => {
        const text = diff.map(part => {
            if (part.type === 'added') return `+ ${part.value}`;
            if (part.type === 'removed') return `- ${part.value}`;
            return `  ${part.value}`;
        }).join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setOriginal('');
        setModified('');
    };

    return (
        <div className="flex flex-col gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64 lg:h-80">
                <div className="flex flex-col gap-2 h-full">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Original Text</label>
                    <textarea
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                        className="flex-1 w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none overflow-y-auto scrollbar-hide"
                        placeholder="Paste original text here..."
                    />
                </div>
                <div className="flex flex-col gap-2 h-full">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Modified Text</label>
                    <textarea
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                        className="flex-1 w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none overflow-y-auto scrollbar-hide"
                        placeholder="Paste modified text here..."
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <AlertCircle size={14} className="text-cyan-500" />
                    <span>Real-time difference tracking enabled</span>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-sm font-bold"
                    >
                        <Trash2 size={16} /> Clear
                    </button>
                    <button
                        onClick={handleCopy}
                        disabled={diff.length === 0}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/5"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy Diff'}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Difference View</label>
                <div className="flex-1 bg-slate-950/50 border border-slate-800/50 rounded-2xl p-6 font-mono text-sm overflow-y-auto scrollbar-hide min-h-[200px]">
                    {diff.length > 0 && (original || modified) ? (
                        <div className="space-y-1">
                            {(() => {
                                let line1 = 1;
                                let line2 = 1;
                                return diff.map((part, index) => {
                                    const currentLine1 = part.type !== 'added' ? line1++ : null;
                                    const currentLine2 = part.type !== 'removed' ? line2++ : null;

                                    return (
                                        <div
                                            key={index}
                                            className={`flex gap-4 px-2 py-0.5 rounded leading-relaxed whitespace-pre-wrap group
                        ${part.type === 'added' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                        ${part.type === 'removed' ? 'bg-rose-500/10 text-rose-400' : ''}
                        ${part.type === 'normal' ? 'text-slate-400 opacity-60' : ''}
                      `}
                                        >
                                            <div className="flex select-none text-[10px] items-center gap-2 w-12 shrink-0 font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                                                <span className="w-5 text-right">{currentLine1 || ''}</span>
                                                <span className="w-5 text-right">{currentLine2 || ''}</span>
                                            </div>
                                            <div className="flex-1 flex gap-2">
                                                <span className="inline-block w-4 shrink-0 select-none opacity-50 font-black">
                                                    {part.type === 'added' ? '+' : part.type === 'removed' ? '-' : ' '}
                                                </span>
                                                <span>{part.value || ' '}</span>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-2 py-12">
                            <div className="w-12 h-12 rounded-full border border-slate-800 border-dashed flex items-center justify-center">
                                <AlertCircle size={20} />
                            </div>
                            Compare texts to see differences here
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiffCheck;
