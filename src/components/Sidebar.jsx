import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ tools, activeTool, setActiveTool, isOpen, setIsOpen }) => {
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
                className={`fixed left-0 top-0 bottom-0 z-45 bg-slate-950 border-r border-slate-800/50 transition-all duration-300 ease-in-out pt-24
          ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        `}
            >
                {/* Toggle Button for Desktop */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-28 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full hidden lg:flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400 transition-all z-50"
                >
                    {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>

                <div className="flex flex-col gap-2 px-4 h-full overflow-y-auto pb-8 scrollbar-hide">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => {
                                setActiveTool(tool.id);
                                if (window.innerWidth < 1024) setIsOpen(false);
                            }}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all group relative
                ${activeTool === tool.id
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                                }
              `}
                            title={!isOpen ? tool.name : ''}
                        >
                            <div className={`p-2 rounded-lg transition-colors
                ${activeTool === tool.id ? 'bg-cyan-400/10' : 'group-hover:bg-slate-800'}
              `}>
                                <tool.icon size={20} />
                            </div>

                            <div className={`flex flex-col items-start transition-opacity duration-200 whitespace-nowrap
                ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none'}
              `}>
                                <span className="font-bold text-sm leading-none">{tool.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">{tool.id.toUpperCase()} TOOL</span>
                            </div>

                            {!isOpen && activeTool === tool.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
                            )}
                        </button>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
