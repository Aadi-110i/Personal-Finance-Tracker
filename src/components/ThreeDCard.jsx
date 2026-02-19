import React, { useRef, useState } from 'react';
import './ThreeDCard.css';

const ThreeDCard = ({ children, className = '', maxRotation = 15, scale = 1.05 }) => {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({});

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Calculate rotation based on mouse position relative to center
        // Rotate Y (left/right tilt) depends on X position
        // Rotate X (up/down tilt) depends on Y position (inverted)
        const rotateX = ((mouseY / (height / 2)) * -maxRotation).toFixed(2);
        const rotateY = ((mouseX / (width / 2)) * maxRotation).toFixed(2);

        // Glare position (0% to 100%)
        const glareX = ((e.clientX - left) / width) * 100;
        const glareY = ((e.clientY - top) / height) * 100;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
            '--mouse-x': `${glareX}%`,
            '--mouse-y': `${glareY}%`
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.5s ease-out'
        });
    };

    const handleMouseEnter = () => {
        // Reset transition to allow fast movement updates
        // We'll set it back in handleMouseLeave for smooth exit
    };

    return (
        <div
            className={`three-d-card-wrap ${className}`}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <div className="three-d-card" style={style}>
                {children}
            </div>
        </div>
    );
};

export default ThreeDCard;
