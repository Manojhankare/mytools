import React from 'react';
import { Menu, X } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors lg:hidden"
                        aria-label="Toggle Sidebar"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase">
                        MY<span className="text-cyan-400">TOOLS</span>
                    </h1>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
                        {/* <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a> */}
                        <a href="https://manojhankare.in" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Support</a>
                        <a
                            href="https://github.com/manojhankare/mytools"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
                        >
                            GitHub
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
