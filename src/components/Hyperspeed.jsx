import React, { useEffect, useRef } from 'react';

const Hyperspeed = ({
    starCount = 1000,
    baseSpeed = 0.05,
    warpSpeed = 0.8,
    starColor = '#22d3ee',
    className = ''
}) => {
    const canvasRef = useRef(null);
    const speedRef = useRef(baseSpeed);
    const starsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            starsRef.current = [];
            for (let i = 0; i < starCount; i++) {
                starsRef.current.push({
                    x: Math.random() * canvas.width - canvas.width / 2,
                    y: Math.random() * canvas.height - canvas.height / 2,
                    z: Math.random() * canvas.width,
                    pz: 0
                });
            }
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'; // Matches Slate 950
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            ctx.strokeStyle = starColor;
            ctx.lineWidth = 1;

            starsRef.current.forEach(star => {
                const x = star.x / (star.z / canvas.width);
                const y = star.y / (star.z / canvas.width);

                if (star.pz !== 0) {
                    const sx = cx + x;
                    const sy = cy + y;
                    const px = cx + (star.x / (star.pz / canvas.width));
                    const py = cy + (star.y / (star.pz / canvas.width));

                    if (sx >= 0 && sx <= canvas.width && sy >= 0 && sy <= canvas.height) {
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(sx, sy);
                        ctx.globalAlpha = 1 - (star.z / canvas.width);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }

                star.pz = star.z;
                star.z -= speedRef.current * 10;

                if (star.z < 1) {
                    star.z = canvas.width;
                    star.pz = 0;
                }
            });

            speedRef.current += (baseSpeed - speedRef.current) * 0.05;

            animationId = requestAnimationFrame(draw);
        };

        const handleInteraction = () => {
            speedRef.current = warpSpeed;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousedown', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('scroll', handleInteraction);

        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousedown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
            cancelAnimationFrame(animationId);
        };
    }, [starCount, baseSpeed, warpSpeed, starColor]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 bg-slate-950 ${className}`}
        />
    );
};

export default Hyperspeed;
