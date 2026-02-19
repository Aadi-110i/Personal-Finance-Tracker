import React, { useMemo } from 'react';
import './SnowBackground.css';

const SnowBackground = () => {
    // Helper to generate random box-shadows simulating particles
    const generateSnow = (n) => {
        let shadows = '';
        for (let i = 0; i < n; i++) {
            const x = Math.random() * 100; // vw
            const y = Math.random() * 100; // vh
            shadows += `${x}vw ${y}vh 0 white, `;
            shadows += `${x}vw ${y - 100}vh 0 white, `; // Duplicate for seamless loop
        }
        return shadows.slice(0, -2);
    };

    // Memoize the static snow layers so they don't regenerate on re-renders
    const layer1 = useMemo(() => generateSnow(100), []);
    const layer2 = useMemo(() => generateSnow(50), []);
    const layer3 = useMemo(() => generateSnow(20), []);

    return (
        <div className="snow-container">
            {/* Layer 1: Small, slow, distant */}
            <div
                className="snow-layer"
                style={{
                    width: '1px',
                    height: '1px',
                    boxShadow: layer1,
                    animationDuration: '20s',
                    opacity: 0.5
                }}
            />

            {/* Layer 2: Medium, normal speed */}
            <div
                className="snow-layer"
                style={{
                    width: '2px',
                    height: '2px',
                    boxShadow: layer2,
                    animationDuration: '15s',
                    opacity: 0.7
                }}
            />

            {/* Layer 3: Large, fast, close */}
            <div
                className="snow-layer"
                style={{
                    width: '3px',
                    height: '3px',
                    boxShadow: layer3,
                    animationDuration: '10s',
                    opacity: 0.9,
                    filter: 'blur(1px)'
                }}
            />
        </div>
    );
};

export default SnowBackground;
