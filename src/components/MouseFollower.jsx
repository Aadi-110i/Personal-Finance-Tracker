import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import './MouseFollower.css';

const MouseFollower = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [hovering, setHovering] = useState(false);

    // Snappier spring physics
    const springConfig = { damping: 20, stiffness: 400, mass: 0.3 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('button') ||
                e.target.closest('a') ||
                e.target.classList.contains('interactive') ||
                e.target.closest('.interactive')) {
                setHovering(true);
            } else {
                setHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Main Dot Cursor */}
            <motion.div
                className={`custom-cursor-dot ${hovering ? 'hovering' : ''}`}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                }}
            />
            {/* Trailing Ring */}
            <motion.div
                className={`custom-cursor-ring ${hovering ? 'hovering' : ''}`}
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                }}
            />
        </>
    );
};

export default MouseFollower;
