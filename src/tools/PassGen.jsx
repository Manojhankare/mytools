import React, { useState, useEffect } from 'react'
import { Check, Clipboard, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react'

const PassGen = () => {
    const [password, setPassword] = useState('')
    const [length, setLength] = useState(16)
    const [options, setOptions] = useState({
        upper: true,
        lower: true,
        numbers: true,
        symbols: true
    })
    const [copied, setCopied] = useState(false)

    const generatePassword = () => {
        const chars = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        }

        let charset = ''
        if (options.upper) charset += chars.upper
        if (options.lower) charset += chars.lower
        if (options.numbers) charset += chars.numbers
        if (options.symbols) charset += chars.symbols

        if (!charset) {
            setPassword('')
            return
        }

        let generated = ''
        for (let i = 0; i < length; i++) {
            generated += charset.charAt(Math.floor(Math.random() * charset.length))
        }
        setPassword(generated)
    }

    useEffect(() => {
        generatePassword()
    }, [length, options])

    const handleCopy = () => {
        navigator.clipboard.writeText(password)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getStrength = () => {
        if (length < 8) return { label: 'Weak', color: 'text-red-400', icon: ShieldAlert }
        if (length < 12) return { label: 'Medium', color: 'text-yellow-400', icon: Shield }
        return { label: 'Strong', color: 'text-emerald-400', icon: ShieldCheck }
    }

    const strength = getStrength()

    return (
        <div className="space-y-8 max-w-2xl mx-auto py-4">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Secure PassGen</h2>
                <p className="text-slate-400">Military-grade entropy at your fingertips</p>
            </div>

            <div className="relative group">
                <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 text-center transition-all group-hover:border-cyan-400/50">
                    <div className="text-3xl font-mono text-cyan-400 break-all mb-4">
                        {password || 'Select options...'}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                        >
                            {copied ? <Check size={18} /> : <Clipboard size={18} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={generatePassword}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                        >
                            <RefreshCw size={18} />
                            Regenerate
                        </button>
                    </div>
                </div>

                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-950 border border-slate-700 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${strength.color}`}>
                    <strength.icon size={12} />
                    {strength.label}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/30 p-8 rounded-3xl border border-slate-800">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-slate-300">Length: {length}</label>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {Object.keys(options).map((key) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={options[key]}
                                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                                className="hidden"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${options[key] ? 'bg-cyan-400 border-cyan-400' : 'border-slate-700 group-hover:border-slate-500'
                                }`}>
                                {options[key] && <Check size={14} className="text-slate-950" />}
                            </div>
                            <span className="text-sm text-slate-400 capitalize group-hover:text-slate-200">
                                {key === 'upper' ? 'Uppercase' : key === 'lower' ? 'Lowercase' : key}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PassGen
