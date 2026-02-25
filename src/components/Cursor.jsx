import React, { useEffect, useState, useRef } from 'react';
import './Cursor.css';

const Cursor = ({ type = 'constellation' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const mainRef = useRef(null);
    const secondaryRef = useRef(null);
    const canvasRef = useRef(null);
    const mouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
    const pos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0, vx: 0, vy: 0 });
    const particles = useRef([]);
    const points = useRef([]);
    const frameCount = useRef(0);

    useEffect(() => {
        particles.current = [];
        points.current = [];
        frameCount.current = 0;
    }, [type]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            mouse.current = { x: clientX, y: clientY };

            if (frameCount.current === 0) {
                pos.current.x = clientX;
                pos.current.y = clientY;
            }

            if (mainRef.current) {
                const offset = type === 'pen' ? 'translate(-50%, 0)' : 'translate(-50%, -50%)';
                mainRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) ${offset}`;
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('a, button, [role="button"], .glass-card')) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        const handleMouseDown = () => setIsActive(true);
        const handleMouseUp = () => setIsActive(false);

        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        let animId;
        const animate = () => {
            const ctx = canvasRef.current?.getContext('2d');
            frameCount.current++;

            const stiffness = isHovered ? 0.3 : 0.15;
            const damping = 0.8;
            const dx = mouse.current.x - pos.current.x;
            const dy = mouse.current.y - pos.current.y;
            pos.current.vx = (pos.current.vx + dx * stiffness) * damping;
            pos.current.vy = (pos.current.vy + dy * stiffness) * damping;
            pos.current.x += pos.current.vx;
            pos.current.y += pos.current.vy;

            if (secondaryRef.current) {
                secondaryRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
            }

            if (ctx) {
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                if (type === 'particles' || isActive) {
                    const spawnCount = isActive ? 5 : 1;
                    for (let i = 0; i < spawnCount; i++) {
                        particles.current.push({
                            x: mouse.current.x, y: mouse.current.y,
                            size: Math.random() * 4 + 1,
                            v: { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 },
                            alpha: 1
                        });
                    }
                }

                particles.current.forEach((p, i) => {
                    p.x += p.v.x; p.y += p.v.y;
                    p.alpha -= 0.02; p.size *= 0.96;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = '#22d3ee';
                    ctx.globalAlpha = p.alpha; ctx.fill();
                    if (p.alpha <= 0) particles.current.splice(i, 1);
                });

                if (type === 'constellation') {
                    const velocity = Math.hypot(pos.current.vx, pos.current.vy);
                    if (velocity > 1.5 && frameCount.current % 3 === 0) {
                        points.current.push({
                            x: mouse.current.x, y: mouse.current.y,
                            v: { x: (Math.random() - 0.5) * 1.5, y: (Math.random() - 0.5) * 1.5 },
                            life: 1
                        });
                    }

                    points.current.forEach((p, i) => {
                        p.x += p.v.x; p.y += p.v.y; p.life -= 0.01;
                        if (p.life <= 0) { points.current.splice(i, 1); return; }

                        points.current.slice(i + 1).forEach(p2 => {
                            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                            if (dist < 100) {
                                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
                                ctx.strokeStyle = `rgba(34, 211, 238, ${p.life * 0.3})`;
                                ctx.lineWidth = 1; ctx.stroke();
                            }
                        });
                        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(34, 211, 238, ${p.life})`; ctx.fill();
                    });
                }
            }

            animId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('resize', handleResize);

        handleResize();
        animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animId);
        };
    }, [type, isHovered, isActive]);

    return (
        <>
            <div className={`cursor-wrapper cursor-${type} ${isHovered ? 'hovering' : ''}`}>
                {type === 'pen' && (
                    <div ref={mainRef} className="cursor-pen-nib-container">
                        <div className="cursor-pen-nib">
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L6 18l6-3 6 3-6-16z" fill="#22d3ee" fillOpacity="0.2" />
                                <path d="M12 2L6 18l6-3 6 3-6-16z" stroke="#22d3ee" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 15V2" stroke="#22d3ee" strokeLinecap="round" />
                                <circle cx="12" cy="2" r="1.5" fill="#fff" className="nib-point" />
                            </svg>
                        </div>
                    </div>
                )}
                {type === 'orbital' && (
                    <>
                        <div ref={mainRef} className="dot" />
                        <div ref={secondaryRef} className="ring" />
                    </>
                )}
                {type === 'crosshair' && (
                    <div ref={mainRef} className="cursor-crosshair">
                        <div className="dot" />
                        <div className="line line-v" />
                        <div className="line line-h" />
                    </div>
                )}
            </div>

            <canvas
                ref={canvasRef}
                className="cursor-canvas"
                style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 100000 }}
            />
        </>
    );
};

export default Cursor;
