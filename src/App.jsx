import React, { useState } from 'react'
import Hyperspeed from './components/Hyperspeed'
import Cursor from './components/Cursor'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import JsonLint from './tools/JsonLint'
import MdViewer from './tools/MdViewer'
import PassGen from './tools/PassGen'
import DiffCheck from './tools/DiffCheck'
import { Braces, FileText, Lock, LayoutGrid, GitCompare } from 'lucide-react'

function App() {
  const [activeTool, setActiveTool] = useState('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [cursorType, setCursorType] = useState('constellation')

  const tools = [
    { id: 'home', name: 'Overview', icon: LayoutGrid, description: 'View all tools' },
    { id: 'json', name: 'JSON Lint', icon: Braces, description: 'Validate and format JSON data' },
    { id: 'md', name: 'MD Viewer', icon: FileText, description: 'Live Markdown preview' },
    { id: 'pass', name: 'PassGen', icon: Lock, description: 'Secure password generator' },
    { id: 'diff', name: 'Diff Check', icon: GitCompare, description: 'Securely compare text' }
  ]

  const renderTool = () => {
    switch (activeTool) {
      case 'json': return <JsonLint />;
      case 'md': return <MdViewer />;
      case 'pass': return <PassGen />;
      case 'diff': return <DiffCheck />;
      default: return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {tools.filter(t => t.id !== 'home').map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="glass-card p-8 rounded-3xl text-left group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 transition-all group-hover:scale-110">
                <tool.icon className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tool.description}
              </p>
            </button>
          ))}
        </div>
      );
    }
  }

  return (
    <div className={`min-h-screen relative font-sans text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden ${cursorType !== 'none' ? 'multi-cursor-active' : ''}`}>
      <Hyperspeed
        starColor="#22d3ee"
        baseSpeed={0.05}
        warpSpeed={1.2}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex flex-1 pt-20">
          <Sidebar
            tools={tools}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />

          <main className={`flex-1 transition-all duration-300 ease-in-out p-6 lg:p-10
            ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}
          `}>
            <div className="max-w-[1400px] mx-auto">
              {activeTool !== 'home' && (
                <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-left-4 duration-500">
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                      {tools.find(t => t.id === activeTool)?.name}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {tools.find(t => t.id === activeTool)?.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTool('home')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-all font-bold group"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
                  </button>
                </div>
              )}

              <div className={activeTool !== 'home' ? 'glass p-8 lg:p-10 rounded-[2.5rem] min-h-[600px] shadow-2xl shadow-cyan-900/5' : ''}>
                {renderTool()}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Cursor type={cursorType} />

      {/* Cursor Switcher */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 p-2 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-slate-800/50">
        {['pen', 'orbital', 'crosshair', 'constellation'].map((type) => (
          <button
            key={type}
            onClick={() => setCursorType(type)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${cursorType === type
              ? 'bg-cyan-400 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20'
              : 'bg-transparent border-transparent text-slate-500 hover:text-cyan-400 hover:bg-slate-900'
              }`}
            title={`Switch to ${type} cursor`}
          >
            <div className="relative">
              <div className={`w-1 h-1 rounded-full bg-current ${cursorType === type ? 'animate-ping' : ''}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
