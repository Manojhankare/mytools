import React, { useState } from 'react'
import Hyperspeed from './components/Hyperspeed'
import Cursor from './components/Cursor'
import JsonLint from './tools/JsonLint'
import MdViewer from './tools/MdViewer'
import PassGen from './tools/PassGen'
import { Braces, FileText, Lock, Settings } from 'lucide-react'

function App() {
  const [activeTool, setActiveTool] = useState('home')
  const [cursorType, setCursorType] = useState('constellation')

  const tools = [
    { id: 'json', name: 'JSON Lint', icon: Braces, description: 'Validate and format JSON data' },
    { id: 'md', name: 'MD Viewer', icon: FileText, description: 'Live Markdown preview' },
    { id: 'pass', name: 'PassGen', icon: Lock, description: 'Secure password generator' }
  ]

  return (
    <div className={`min-h-screen relative font-sans ${cursorType !== 'none' ? 'multi-cursor-active' : ''}`}>
      <Hyperspeed
        starColor="#22d3ee"
        baseSpeed={0.05}
        warpSpeed={1.2}
      />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-6xl font-black tracking-tighter text-white mb-4 italic uppercase">
            MY<span className="text-cyan-400">TOOLS</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto font-medium">
            Next-gen utility suite with Cyberpunk aesthetics.
          </p>
        </header>

        {activeTool === 'home' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="glass-card p-10 rounded-3xl text-left group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-8 group-hover:bg-cyan-400/20 transition-all group-hover:scale-110">
                  <tool.icon className="text-cyan-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{tool.name}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {tool.description}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="glass p-10 rounded-[2.5rem] min-h-[650px] shadow-2xl shadow-cyan-900/10">
            <button
              onClick={() => setActiveTool('home')}
              className="mb-10 text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-all font-bold group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Suite
            </button>
            {activeTool === 'json' && <JsonLint />}
            {activeTool === 'md' && <MdViewer />}
            {activeTool === 'pass' && <PassGen />}
          </div>
        )}
      </div>

      <Cursor type={cursorType} />

      <div className="fixed bottom-8 left-8 z-50 flex gap-2">
        {['pen', 'orbital', 'crosshair', 'constellation'].map((type) => (
          <button
            key={type}
            onClick={() => setCursorType(type)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${cursorType === type
                ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-cyan-400'
              }`}
            title={`Switch to ${type} cursor`}
          >
            <Settings size={14} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
