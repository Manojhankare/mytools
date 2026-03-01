import React, { useEffect, useRef, useState } from 'react';
import './Cursor.css';

const Cursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const onMove = (e) => {
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }
            if (ringRef.current) {
                ringRef.current.style.left = `${e.clientX}px`;
                ringRef.current.style.top = `${e.clientY}px`;
            }
        };

        const onOver = (e) => {
            setIsHovered(!!e.target.closest('a, button, [role="button"], .glass-card, textarea, input'));
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseover', onOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className={`cursor-dot ${isHovered ? 'hovered' : ''}`} />
            <div ref={ringRef} className={`cursor-ring ${isHovered ? 'hovered' : ''}`} />
        </>
    );
};

export default Cursor;
