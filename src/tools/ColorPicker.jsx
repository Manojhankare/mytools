import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, RefreshCw, Pipette, Check, MousePointer2 } from 'lucide-react';

const ColorPicker = () => {
    // We'll use HSV for internal state as it's easier to map to 2D UI
    const [hsv, setHsv] = useState({ h: 188, s: 85, v: 93 }); // cyan-400 equivalent
    const [formats, setFormats] = useState({ hex: '#22d3ee', rgb: 'rgb(34, 211, 238)', hsl: 'hsl(188, 85%, 53%)' });
    const [copied, setCopied] = useState(null);
    const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);

    const sbRef = useRef(null);
    const hueRef = useRef(null);

    useEffect(() => {
        setIsEyeDropperSupported(!!window.EyeDropper);
    }, []);

    // --- Color Conversion Utilities ---
    const hsvToRgb = (h, s, v) => {
        const s_val = s / 100;
        const v_val = v / 100;
        const i = Math.floor(h / 60);
        const f = h / 60 - i;
        const p = v_val * (1 - s_val);
        const q = v_val * (1 - f * s_val);
        const t = v_val * (1 - (1 - f) * s_val);
        let r, g, b;
        switch (i % 6) {
            case 0: r = v_val; g = t; b = p; break;
            case 1: r = q; g = v_val; b = p; break;
            case 2: r = p; g = v_val; b = t; break;
            case 3: r = p; g = q; b = v_val; break;
            case 4: r = t; g = p; b = v_val; break;
            case 5: r = v_val; g = p; b = q; break;
            default: r = 0; g = 0; b = 0; break;
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    const rgbToHex = (r, g, b) => {
        const toHex = (n) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: h = 0; break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    };

    const hexToHsv = (hex) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16); g = parseInt(hex[2] + hex[2], 16); b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16); g = parseInt(hex.substring(3, 5), 16); b = parseInt(hex.substring(5, 7), 16);
        }
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const v = max;
        const d = max - min;
        const s = max === 0 ? 0 : d / max;
        let h;
        if (max === min) h = 0;
        else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: h = 0; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
    };

    // --- Interaction Handlers ---
    const handleSBMove = useCallback((e) => {
        if (!sbRef.current) return;
        const rect = sbRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        setHsv(prev => ({ ...prev, s: Math.round(x * 100), v: Math.round((1 - y) * 100) }));
    }, []);

    const handleHueMove = useCallback((e) => {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        setHsv(prev => ({ ...prev, h: Math.round(y * 360) }));
    }, []);

    const startDrag = (handler) => {
        const move = (e) => handler(e);
        const stop = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
    };

    const handleEyeDropper = async () => {
        if (!window.EyeDropper) return;
        const eyeDropper = new window.EyeDropper();
        try {
            const result = await eyeDropper.open();
            setHsv(hexToHsv(result.sRGBHex));
        } catch (e) {
            console.error('EyeDropper closed or failed', e);
        }
    };

    // Update derived formats whenever HSV changes
    useEffect(() => {
        const [r, g, b] = hsvToRgb(hsv.h, hsv.s, hsv.v);
        const hex = rgbToHex(r, g, b);
        const [h_hsl, s_hsl, l_hsl] = rgbToHsl(r, g, b);
        setFormats({
            hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            hsl: `hsl(${h_hsl}, ${s_hsl}%, ${l_hsl}%)`
        });
    }, [hsv]);

    const presets = ['#f87171', '#fb923c', '#fbbf24', '#4ade80', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6', '#94a3b8'];

    const copyToClipboard = (val, key) => {
        navigator.clipboard.writeText(val);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const generateRandom = () => {
        const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setHsv(hexToHsv(hex));
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Professional Picker</h2>
                    <p className="text-slate-500 text-sm italic">Precision color selection and screen sampling</p>
                </div>
                <div className="flex items-center gap-2">
                    {isEyeDropperSupported && (
                        <button
                            onClick={handleEyeDropper}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 border border-slate-700/50 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
                            title="Pick color from screen"
                        >
                            <Pipette size={14} /> Color Picker
                        </button>
                    )}
                    <button
                        onClick={generateRandom}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
                    >
                        <RefreshCw size={14} /> Random
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start text-left">
                <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
                    {/* Saturation & Brightness Area */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Saturation & Brightness</label>
                        <div
                            ref={sbRef}
                            onMouseDown={(e) => { handleSBMove(e); startDrag(handleSBMove); }}
                            className="relative w-full sm:w-80 aspect-square rounded-2xl border border-white/10 shadow-2xl cursor-crosshair overflow-hidden touch-none"
                            style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                            <div
                                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 border-2 border-white rounded-full shadow-lg pointer-events-none transition-transform active:scale-125"
                                style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, backgroundColor: formats.hex }}
                            />
                        </div>
                    </div>

                    {/* Hue Slider */}
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hue</label>
                        <div
                            ref={hueRef}
                            onMouseDown={(e) => { handleHueMove(e); startDrag(handleHueMove); }}
                            className="relative w-full sm:w-10 h-6 sm:h-80 rounded-2xl border border-white/10 shadow-lg cursor-ns-resize overflow-hidden touch-none"
                            style={{ background: 'linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}
                        >
                            <div
                                className="absolute w-full h-2 -mt-1 border-y-2 border-white bg-white/20 shadow-md pointer-events-none transition-all"
                                style={{ top: `${(hsv.h / 360) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Info & Presets */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                    <div className="glass p-6 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative overflow-hidden text-left">
                        {/* Status Glow */}
                        <div
                            className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-20 pointer-events-none transition-colors duration-500"
                            style={{ backgroundColor: formats.hex }}
                        />

                        <div className="flex items-center gap-6">
                            <div
                                className="w-24 h-24 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group"
                                style={{ backgroundColor: formats.hex }}
                            >
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <MousePointer2 size={16} className="text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-4xl font-black text-white tracking-widest font-mono mb-1">{formats.hex}</div>
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: formats.hex }} /> Live Preview
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(formats).map(([key, value]) => (
                                <div key={key} className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{key}</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            readOnly
                                            value={value}
                                            className="w-full bg-slate-950/50 border border-slate-800/50 rounded-xl px-4 py-3 text-cyan-400 font-mono text-sm focus:outline-none transition-all group-hover:border-cyan-500/20"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(value, key)}
                                            className={`absolute right-2 top-1.5 p-1.5 rounded-lg transition-all ${copied === key ? 'text-green-400 bg-green-400/10' : 'text-slate-500 hover:text-cyan-400'}`}
                                        >
                                            {copied === key ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Quick Presets</label>
                            <div className="flex flex-wrap gap-2">
                                {presets.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setHsv(hexToHsv(p))}
                                        className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${formats.hex === p ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        style={{ backgroundColor: p }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
