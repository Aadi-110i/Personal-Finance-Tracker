import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ScrollReveal from '../components/ScrollReveal';
import './MarketPage.css';

const MarketPage = () => {
    // Dummy data for crypto trends
    const bitcoinData = [
        { time: '10:00', price: 42000 },
        { time: '11:00', price: 42500 },
        { time: '12:00', price: 41800 },
        { time: '13:00', price: 43200 },
        { time: '14:00', price: 43800 },
        { time: '15:00', price: 43500 },
        { time: '16:00', price: 44200 },
    ];

    const ethData = [
        { time: '10:00', price: 2800 },
        { time: '11:00', price: 2850 },
        { time: '12:00', price: 2900 },
        { time: '13:00', price: 2880 },
        { time: '14:00', price: 2950 },
        { time: '15:00', price: 3000 },
        { time: '16:00', price: 3100 },
    ];

    const MarketCard = ({ title, price, change, data, color }) => (
        <div className="market-card glass-panel">
            <div className="market-header">
                <div>
                    <h3>{title}</h3>
                    <span className="market-price">₹{price.toLocaleString()}</span>
                </div>
                <span className={`market-change ${change >= 0 ? 'positive' : 'negative'}`}>
                    {change > 0 ? '+' : ''}{change}%
                </span>
            </div>
            <div className="market-chart">
                <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            fillOpacity={1}
                            fill={`url(#color${title})`}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <motion.div
            className="market-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="neon-text"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Market Overview
            </motion.h1>
            <motion.p
                className="page-subtitle"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Real-time market trends and analysis
            </motion.p>

            <div className="market-grid">
                {[
                    { title: "Bitcoin (BTC)", price: 44200, change: 5.2, data: bitcoinData, color: "#f59e0b" },
                    { title: "Ethereum (ETH)", price: 3100, change: 8.4, data: ethData, color: "#6366f1" },
                    { title: "Solana (SOL)", price: 105, change: -1.2, data: bitcoinData, color: "#10b981" },
                    { title: "Cardano (ADA)", price: 1.2, change: 2.1, data: ethData, color: "#3b82f6" }
                ].map((item, index) => (
                    <ScrollReveal key={item.title} delay={index * 0.1} direction="up">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                        >
                            <MarketCard
                                title={item.title}
                                price={item.price}
                                change={item.change}
                                data={item.data}
                                color={item.color}
                            />
                        </motion.div>
                    </ScrollReveal>
                ))}
            </div>

            <ScrollReveal direction="up" delay={0.8}>
                <motion.div
                    className="market-analysis glass-panel-premium hover-glow p-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <h2 className="text-xl font-semibold mb-2 text-white">Market Analysis</h2>
                    <p className="text-gray-300 leading-relaxed">
                        The cryptocurrency market is showing strong bullish momentum today, led by Ethereum's breakout above the ₹3,000 resistance level.
                        Global trading volume has increased by 15% in the last 24 hours.
                    </p>
                </motion.div>
            </ScrollReveal>
        </motion.div>
    );
};

export default MarketPage;
