import React, { useEffect, useRef } from 'react';
import './FrostyCursor.css';

const FrostyCursor = () => {
    const cursorRef = useRef(null);
    const particleContainerRef = useRef(null);

    useEffect(() => {
        const colors = [
            '#ffffff', // White
            '#e6e6fa', // Lavender
            '#dbeafe', // Icy Blue
            '#f3e8ff'  // Pale Purple
        ];

        const createParticle = (x, y) => {
            if (!particleContainerRef.current) return;

            const particle = document.createElement('div');
            particle.className = 'frosty-particle';

            // Random properties
            const size = Math.random() * 4 + 2; // 2px to 6px
            const color = colors[Math.floor(Math.random() * colors.length)];
            const randomX = (Math.random() - 0.5) * 10; // Slight random drift X
            const randomY = (Math.random() - 0.5) * 10; // Slight random drift Y

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            particle.style.left = `${x + randomX}px`;
            particle.style.top = `${y + randomY}px`;
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

            particleContainerRef.current.appendChild(particle);

            // Cleanup after animation
            setTimeout(() => {
                if (particle && particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000); // Matches CSS animation duration
        };

        let lastX = 0;
        let lastY = 0;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;

            // Move main cursor
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
            }

            // Create particles based on distance moved (interpolated for smoothness)
            const dist = Math.hypot(clientX - lastX, clientY - lastY);

            if (dist > 5) { // Only spawn if moved enough
                createParticle(clientX, clientY);
                lastX = clientX;
                lastY = clientY;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="frosty-cursor-dot"
                style={{ top: 0, left: 0, marginTop: '-4px', marginLeft: '-4px' }} // Center fix
            />
            <div ref={particleContainerRef} id="frosty-particles" />
        </>
    );
};

export default FrostyCursor;
