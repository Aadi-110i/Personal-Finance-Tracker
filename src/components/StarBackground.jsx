import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './StarBackground.css';

const StarBackground = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

    return (
        <div className="star-background-container">
            <div className="stars-layer layer-1"></div>
            <div className="stars-layer layer-2"></div>
            <motion.div style={{ y: y1 }} className="floating-particles layer-3" />
            <motion.div style={{ y: y2 }} className="floating-particles layer-4" />
        </div>
    );
};

export default StarBackground;
