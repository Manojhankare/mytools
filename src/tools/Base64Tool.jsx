import React, { useState } from 'react';
import { Copy, ArrowRightLeft, Upload, Download, Trash2, Check, AlertCircle } from 'lucide-react';

const Base64Tool = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleProcess = (text, currentMode) => {
        setError('');
        if (!text) {
            setOutput('');
            return;
        }
        try {
            if (currentMode === 'encode') {
                setOutput(btoa(unescape(encodeURIComponent(text))));
            } else {
                setOutput(decodeURIComponent(escape(atob(text))));
            }
        } catch (err) {
            setError('Invalid Base64 string or encoding error.');
            setOutput('');
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);
        handleProcess(val, mode);
    };

    const toggleMode = () => {
        const newMode = mode === 'encode' ? 'decode' : 'encode';
        setMode(newMode);
        setInput(output);
        handleProcess(output, newMode);
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        Base64 <span className="px-2 py-0.5 rounded-md bg-cyan-400/10 text-cyan-400 text-xs uppercase tracking-widest font-black">{mode}r</span>
                    </h2>
                    <p className="text-slate-500 text-sm italic">Secure browser-side encoding and decoding</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleMode}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-cyan-400 border border-slate-700/50 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowRightLeft size={14} />
                        {mode === 'encode' ? 'Decode' : 'Encode'}
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-700/50 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        <Trash2 size={14} />
                        Reset
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[450px]">
                {/* Input Area */}
                <div className="flex flex-col gap-3 group">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Content</label>
                        <span className="text-[10px] text-slate-600 font-mono tracking-tighter">{input.length} chars</span>
                    </div>
                    <textarea
                        value={input}
                        onChange={handleChange}
                        placeholder={mode === 'encode' ? "Enter text here to encode..." : "Paste Base64 here to decode..."}
                        className="flex-1 w-full bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 text-slate-300 font-mono text-sm focus:outline-none focus:border-cyan-500/30 focus:bg-slate-900/60 resize-none transition-all placeholder:text-slate-700"
                    />
                </div>

                {/* Output Area */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Result</label>
                        <button
                            onClick={copyToClipboard}
                            disabled={!output}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${copied ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/5'} disabled:opacity-30`}
                        >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Waiting for input..."
                            className={`w-full h-full bg-slate-950/60 border ${error ? 'border-red-500/30' : 'border-slate-800/50'} rounded-2xl p-5 text-cyan-400 font-mono text-sm focus:outline-none resize-none transition-all placeholder:text-slate-800`}
                        />
                        {error && (
                            <div className="absolute inset-x-4 bottom-4 animate-in zoom-in-95 duration-200">
                                <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-3">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}
                        {!error && output && (
                            <div className="absolute right-6 bottom-6 animate-in fade-in duration-500">
                                <span className="bg-cyan-400/10 text-cyan-400 text-[10px] px-2 py-1 rounded font-mono uppercase">Processed</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Base64Tool;
