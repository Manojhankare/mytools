import React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

const Sidebar = ({ tools, activeTool, handleSetActiveTool, isOpen, setIsOpen }) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed left-0 top-0 bottom-0 z-45 bg-slate-950/95 backdrop-blur-md border-r border-slate-800/50 transition-all duration-300 ease-in-out pt-20 flex flex-col
          ${isOpen ? 'translate-x-0 w-60' : '-translate-x-full lg:translate-x-0 lg:w-16'}
        `}
            >
                {/* Sidebar Header with Toggle */}
                <div className={`flex items-center px-3 py-3 border-b border-slate-800/30 ${isOpen ? 'justify-between' : 'justify-center'}`}>
                    {isOpen && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tools</span>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-7 h-7 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-400/30 hidden lg:flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all"
                        title={isOpen ? 'Collapse' : 'Expand'}
                    >
                        {isOpen ? <ChevronsLeft size={14} /> : <ChevronsRight size={14} />}
                    </button>
                </div>

                {/* Tool List */}
                <div className="flex flex-col gap-0.5 px-2 py-2 flex-1 overflow-y-auto scrollbar-hide">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => {
                                handleSetActiveTool(tool.id);
                                if (window.innerWidth < 1024) setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all group relative
                ${activeTool === tool.id
                                    ? 'bg-cyan-500/10 text-cyan-400'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }
              `}
                            title={!isOpen ? tool.name : ''}
                        >
                            <div className={`shrink-0 p-1.5 rounded-md transition-colors
                ${activeTool === tool.id ? 'bg-cyan-400/10' : 'group-hover:bg-slate-800'}
              `}>
                                <tool.icon size={16} />
                            </div>

                            <span className={`font-medium text-sm transition-all duration-200 whitespace-nowrap
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden pointer-events-none'}
              `}>
                                {tool.name}
                            </span>

                            {!isOpen && activeTool === tool.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-cyan-400 rounded-r-full" />
                            )}
                        </button>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
