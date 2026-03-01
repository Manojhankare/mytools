import React, { useState } from 'react'
import Cursor from './components/Cursor'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import JsonLint from './tools/JsonLint'
import MdViewer from './tools/MdViewer'
import PassGen from './tools/PassGen'
import DiffCheck from './tools/DiffCheck'
import { Braces, FileText, Lock, LayoutGrid, GitCompare, Wrench, Sparkles, ArrowRight, Github, Globe } from 'lucide-react'

function App() {
  const [activeTool, setActiveTool] = useState('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleSetActiveTool = (id) => {
    setActiveTool(id)
    if (id !== 'home') {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }

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
      case 'md': return <MdViewer isSidebarOpen={isSidebarOpen} />;
      case 'pass': return <PassGen />;
      case 'diff': return <DiffCheck />;
      default: return null;
    }
  }

  const HomePage = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-medium mb-2">
          <Sparkles size={12} />
          Open Source · Free Forever
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
          Your Personal <span className="text-cyan-400">Toolkit</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          A growing collection of developer tools — fast, private, and built to work right in your browser. No sign-ups, no tracking.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.filter(t => t.id !== 'home').map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSetActiveTool(tool.id)}
            className="glass-card p-6 rounded-2xl text-left group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-400/20 transition-all group-hover:scale-110">
                <tool.icon className="text-cyan-400" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{tool.name}</h3>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-slate-400 text-sm mt-1">{tool.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="glass-card p-6 rounded-2xl border-dashed !border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <Wrench className="text-slate-500" size={18} />
          <h3 className="text-sm font-bold text-slate-300">More Tools Coming</h3>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          This project is actively growing. Upcoming tools include a Base64 encoder, Color Picker, Regex Tester, UUID Generator, Lorem Ipsum Generator, and more. Stay tuned!
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Built by <a href="https://manojhankare.in" target="_blank" rel="noopener noreferrer" className="text-cyan-400/70 hover:text-cyan-400 transition-colors font-medium">Manoj Hankare</a>
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/manojhankare/mytools" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
              <Github size={13} /> Source
            </a>
            <a href="https://manojhankare.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
              <Globe size={13} /> Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  )

  return (
    <div className="min-h-screen relative font-sans text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden multi-cursor-active">
      {/* Professional gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(34,211,238,0.05)_0%,_transparent_50%)]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex flex-1 pt-20">
          <Sidebar
            tools={tools}
            activeTool={activeTool}
            handleSetActiveTool={handleSetActiveTool}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />

          <main className={`flex-1 transition-all duration-300 ease-in-out p-6 lg:p-8
            ${isSidebarOpen ? 'lg:ml-60' : 'lg:ml-16'}
          `}>
            <div className="max-w-[1200px] mx-auto">
              {activeTool !== 'home' && activeTool !== 'md' && (
                <div className="mb-6 flex items-center justify-between animate-in fade-in slide-in-from-left-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                      {tools.find(t => t.id === activeTool)?.name}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {tools.find(t => t.id === activeTool)?.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSetActiveTool('home')}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-all text-sm font-bold group"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
                  </button>
                </div>
              )}

              {activeTool === 'home' ? (
                <HomePage />
              ) : (
                <div className={
                  activeTool === 'md' ? 'min-h-[calc(100vh-8rem)]' :
                    'glass p-6 lg:p-8 rounded-2xl min-h-[500px] shadow-2xl shadow-cyan-900/5'
                }>
                  {renderTool()}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Cursor />
    </div>
  )
}

export default App
