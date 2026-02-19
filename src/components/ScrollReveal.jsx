import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const ScrollReveal = ({ children, width = "fit-content", delay = 0, direction = "up", duration = 0.5, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 75 : direction === "down" ? -75 : 0,
            x: direction === "left" ? 75 : direction === "right" ? -75 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration, delay, ease: "easeOut" }
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            animate={mainControls}
            className={className}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
