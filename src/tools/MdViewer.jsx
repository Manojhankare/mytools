import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Eye, Code } from 'lucide-react'

const MdViewer = () => {
    const [input, setInput] = useState('# Hello World\n\nStart typing to see the **preview**!')
    const [mode, setMode] = useState('split') // split, edit, preview

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    MD Viewer <span className="text-sm font-mono text-cyan-400/50">v1.0</span>
                </h2>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    {[
                        { id: 'edit', label: 'Edit', icon: Code },
                        { id: 'split', label: 'Split', icon: null },
                        { id: 'preview', label: 'Preview', icon: Eye }
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === m.id ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {m.icon && <m.icon size={14} />}
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`grid gap-6 flex-1 min-h-[400px] ${mode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                }`}>
                {(mode === 'edit' || mode === 'split') && (
                    <div className="flex flex-col h-full">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-slate-300 font-mono text-sm focus:outline-none focus:border-cyan-400/50 resize-none leading-relaxed"
                            placeholder="# Write markdown..."
                        />
                    </div>
                )}

                {(mode === 'preview' || mode === 'split') && (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-8 overflow-auto prose prose-invert prose-cyan max-w-none">
                            <ReactMarkdown>{input}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MdViewer
