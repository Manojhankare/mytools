import React, { useState } from 'react'
import { Check, Clipboard, AlertCircle } from 'lucide-react'

const JsonLint = () => {
    const [input, setInput] = useState('')
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    const handleValidate = () => {
        try {
            if (!input.trim()) {
                setError(null)
                setResult(null)
                return
            }
            const parsed = JSON.parse(input)
            const formatted = JSON.stringify(parsed, null, 2)
            setResult(formatted)
            setError(null)
        } catch (err) {
            setError(err.message)
            setResult(null)
        }
    }

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    JSON Lint <span className="text-sm font-mono text-cyan-400/50">v1.0</span>
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setInput('')}
                        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleValidate}
                        className="px-6 py-2 bg-cyan-400 text-slate-950 rounded-lg font-bold hover:bg-cyan-300 transition-colors"
                    >
                        Format & Validate
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-2 font-mono">Input Raw JSON</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='{"paste": "your", "json": "here"}'
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-cyan-400/50 resize-none"
                    />
                </div>

                <div className="flex flex-col relative">
                    <label className="text-sm text-slate-400 mb-2 font-mono">Output Formatted</label>
                    <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm relative group overflow-hidden">
                        {error && (
                            <div className="text-red-400 flex items-start gap-2 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                <AlertCircle size={18} className="mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                        {result && !error && (
                            <>
                                <pre className="text-cyan-300 h-full overflow-auto whitespace-pre-wrap">{result}</pre>
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-300 rounded-md hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                                </button>
                            </>
                        )}
                        {!result && !error && (
                            <div className="text-slate-600 flex items-center justify-center h-full">
                                Waiting for input...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JsonLint
