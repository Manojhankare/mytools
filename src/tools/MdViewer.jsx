import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Eye, Code, Loader2, ZoomIn, ZoomOut, ArrowUp, Columns2 } from 'lucide-react'
import MermaidComponent from '../components/md/MermaidComponent'
import ThemedCodeBlock from '../components/md/ThemedCodeBlock'

const ZOOM_LEVELS = [60, 70, 80, 90, 100, 110, 125, 150]
const DEFAULT_ZOOM_INDEX = 4

const MdViewer = ({ isSidebarOpen }) => {
    const [input, setInput] = useState(`# Laboratory Workflow Plan

## System Architecture
\`\`\`mermaid
graph TB
    A[Physician EMR] -->|Creates| B[Lab Requisition]
    B -->|Collect| C[Sample]
    C -->|Results| D[Lab Report]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style D fill:#e8f5e9
\`\`\`

## Status Definitions
| Status | Description | UI Location |
|:-------|:------------|:------------|
| **pending** | Awaiting collection | Sample Tab |
| **processing** | In laboratory | Add Results |
| **reported** | Final printed | Reports Tab |

## Code Highlighting
\`\`\`json
{
  "status": "optimized",
  "version": "1.4",
  "features": ["Mermaid", "GFM Tables", "Typography", "Zoom"]
}
\`\`\`
`)
    const [debouncedInput, setDebouncedInput] = useState(input)
    const [isUpdating, setIsUpdating] = useState(false)
    const [mode, setMode] = useState('split')
    const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX)
    const [showBackToTop, setShowBackToTop] = useState(false)
    const previewRef = useRef(null)

    const zoomLevel = ZOOM_LEVELS[zoomIndex]

    useEffect(() => {
        setIsUpdating(true)
        const handler = setTimeout(() => {
            setDebouncedInput(input)
            setIsUpdating(false)
        }, 500)
        return () => clearTimeout(handler)
    }, [input])

    const handlePreviewScroll = useCallback((e) => {
        setShowBackToTop(e.target.scrollTop > 300)
    }, [])

    const scrollToTop = () => {
        previewRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const zoomIn = () => setZoomIndex(i => Math.min(i + 1, ZOOM_LEVELS.length - 1))
    const zoomOut = () => setZoomIndex(i => Math.max(i - 1, 0))
    const resetZoom = () => setZoomIndex(DEFAULT_ZOOM_INDEX)

    const MarkdownComponents = {
        code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const value = String(children).replace(/\n$/, '')

            // Block code: has a className like "language-xxx"
            if (match) {
                if (language === 'mermaid') {
                    return <MermaidComponent chart={value} />
                }
                return <ThemedCodeBlock language={language} value={value} />
            }

            // Inline code: no language class
            return (
                <code
                    className={className}
                    style={{
                        background: 'rgba(34, 211, 238, 0.1)',
                        color: '#22d3ee',
                        padding: '0.15em 0.4em',
                        borderRadius: '4px',
                        fontSize: '0.85em',
                        fontFamily: 'JetBrains Mono, monospace',
                    }}
                    {...props}
                >
                    {children}
                </code>
            )
        }
    }

    const modes = [
        { id: 'edit', label: 'Edit', icon: Code },
        { id: 'split', label: 'Split', icon: Columns2 },
        { id: 'preview', label: 'Preview', icon: Eye }
    ]

    return (
        <div className="fixed inset-0 flex flex-col z-20 transition-all duration-300" style={{ top: '80px', left: isSidebarOpen ? '240px' : '64px' }}>
            {/* Fixed Toolbar */}
            <div className="flex items-center justify-between bg-slate-950/90 backdrop-blur-md py-2 px-4 border-b border-slate-800/50 shrink-0">
                <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-white tracking-tight">MD Viewer</h2>
                    <span className="text-[10px] font-mono text-cyan-400/40 bg-cyan-400/5 px-1.5 py-0.5 rounded">v1.4</span>
                    {isUpdating && <Loader2 className="animate-spin text-cyan-400" size={14} />}
                </div>

                <div className="flex bg-slate-900/80 rounded-lg p-0.5 border border-slate-700/50">
                    {modes.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${mode === m.id
                                ? 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/20'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <m.icon size={12} />
                            <span className="hidden sm:inline">{m.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={zoomOut} disabled={zoomIndex === 0}
                        className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Zoom Out">
                        <ZoomOut size={14} />
                    </button>
                    <button onClick={resetZoom}
                        className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors min-w-[36px] text-center"
                        title="Reset Zoom">
                        {zoomLevel}%
                    </button>
                    <button onClick={zoomIn} disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                        className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Zoom In">
                        <ZoomIn size={14} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 min-h-0 grid gap-0 ${mode === 'split' ? 'grid-cols-2' : 'grid-cols-1'
                }`}>
                {/* Editor */}
                {(mode === 'edit' || mode === 'split') && (
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-full bg-slate-950/30 border-r border-slate-800/30 p-4 text-slate-300 font-mono text-sm focus:outline-none resize-none leading-relaxed overflow-auto"
                        placeholder="# Write markdown..."
                        spellCheck={false}
                    />
                )}

                {/* Preview */}
                {(mode === 'preview' || mode === 'split') && (
                    <div className="relative h-full">
                        <div
                            ref={previewRef}
                            onScroll={handlePreviewScroll}
                            className="absolute inset-0 overflow-auto p-6 bg-slate-900/60 prose prose-invert prose-cyan max-w-none"
                        >
                            <div style={{ fontSize: `${zoomLevel}%` }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                                    {debouncedInput}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Back to Top */}
                        {showBackToTop && (
                            <button
                                onClick={scrollToTop}
                                className="absolute bottom-6 right-6 z-50 p-2.5 bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/30 text-cyan-400 rounded-full backdrop-blur-md transition-all shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/20 hover:scale-110"
                                title="Back to top"
                            >
                                <ArrowUp size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MdViewer
