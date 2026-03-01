import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { AlertCircle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Initialize mermaid with the theme that fits the cyberpunk aesthetic
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'JetBrains Mono, monospace',
    flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
    },
    sequence: {
        useMaxWidth: false,
    },
    gantt: {
        useMaxWidth: false,
    },
    themeVariables: {
        primaryColor: '#1e293b',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#0891b2',
        lineColor: '#475569',
        secondaryColor: '#0f172a',
        tertiaryColor: '#020617',
        mainBkg: '#1e293b',
        nodeBorder: '#0891b2',
        clusterBkg: '#0f172a',
        clusterBorder: '#334155',
        titleColor: '#22d3ee',
        edgeLabelBackground: '#020617',
        nodeTextColor: '#e2e8f0',
        labelTextColor: '#e2e8f0',
    }
});

// Post-process the SVG to enforce dark theme and remove max-width
function postProcessSvg(svgString) {
    let processed = svgString.replace(/max-width:\s*[\d.]+px/gi, 'max-width: none');

    const lightFillReplacements = [
        { pattern: /fill:\s*#e1f5ff/gi, replacement: 'fill: #1e3a5f' },
        { pattern: /fill:\s*#bbdefb/gi, replacement: 'fill: #1e3a5f' },
        { pattern: /fill:\s*#e3f2fd/gi, replacement: 'fill: #1e3a5f' },
        { pattern: /fill:\s*#fff4e1/gi, replacement: 'fill: #3d2e0a' },
        { pattern: /fill:\s*#fff8e1/gi, replacement: 'fill: #3d2e0a' },
        { pattern: /fill:\s*#fff3e0/gi, replacement: 'fill: #3d2e0a' },
        { pattern: /fill:\s*#e8f5e9/gi, replacement: 'fill: #0a3d1e' },
        { pattern: /fill:\s*#c8e6c9/gi, replacement: 'fill: #0a3d1e' },
        { pattern: /fill:\s*#f3e5f5/gi, replacement: 'fill: #2d1a3e' },
        { pattern: /fill:\s*#e1bee7/gi, replacement: 'fill: #2d1a3e' },
        { pattern: /fill:\s*#fce4ec/gi, replacement: 'fill: #3d0a1e' },
        { pattern: /fill:\s*#ffebee/gi, replacement: 'fill: #3d0a1e' },
        { pattern: /fill:\s*#fff(?:fff)?(?:\b|;)/gi, replacement: 'fill: #1e293b;' },
        { pattern: /fill:\s*#fafafa/gi, replacement: 'fill: #1e293b' },
        { pattern: /fill:\s*#f5f5f5/gi, replacement: 'fill: #1e293b' },
        { pattern: /fill:\s*#ececff/gi, replacement: 'fill: #1e293b' },
    ];

    for (const { pattern, replacement } of lightFillReplacements) {
        processed = processed.replace(pattern, replacement);
    }

    processed = processed.replace(
        /(<(?:text|tspan)[^>]*?)fill\s*=\s*"#[0-9a-f]{3,6}"/gi,
        '$1fill="#e2e8f0"'
    );

    return processed;
}

let idCounter = 0;

const MermaidComponent = ({ chart }) => {
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(null);
    const [zoom, setZoom] = useState(100);

    const renderChart = useCallback(async () => {
        if (!chart) return;

        try {
            setError(null);
            const uniqueId = `mermaid-${Date.now()}-${idCounter++}`;
            const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);
            setSvg(postProcessSvg(renderedSvg));
        } catch (err) {
            console.error('Mermaid rendering error:', err);
            setError(err.message || 'Syntax error in mermaid chart');
            const tempEl = document.getElementById(`d${idCounter - 1}`);
            if (tempEl) tempEl.remove();
        }
    }, [chart]);

    useEffect(() => {
        renderChart();
    }, [renderChart]);

    const handleZoomIn = () => setZoom(z => Math.min(z + 20, 200));
    const handleZoomOut = () => setZoom(z => Math.max(z - 20, 40));
    const handleResetZoom = () => setZoom(100);

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl my-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <div className="text-sm">
                    <p className="text-red-500 font-bold mb-1">Mermaid Syntax Error</p>
                    <code className="text-[10px] text-red-400/80 block break-all font-mono">{error}</code>
                </div>
            </div>
        );
    }

    return (
        <div className="mermaid-container relative bg-slate-950/50 rounded-xl border border-slate-800 my-6 backdrop-blur-sm group">
            {/* Zoom Controls */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-sm rounded-lg p-0.5 border border-slate-700/50">
                <button onClick={handleZoomOut} className="p-1.5 text-slate-400 hover:text-cyan-400 rounded transition-colors" title="Zoom Out">
                    <ZoomOut size={13} />
                </button>
                <button onClick={handleResetZoom} className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 px-1 min-w-[32px] text-center" title="Reset">
                    {zoom}%
                </button>
                <button onClick={handleZoomIn} className="p-1.5 text-slate-400 hover:text-cyan-400 rounded transition-colors" title="Zoom In">
                    <ZoomIn size={13} />
                </button>
            </div>

            {/* Diagram */}
            <div className="overflow-x-auto p-6">
                <div
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </div>
        </div>
    );
};

export default MermaidComponent;
