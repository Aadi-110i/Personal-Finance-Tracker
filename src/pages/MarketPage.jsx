import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
                    <span className="market-price">${price.toLocaleString()}</span>
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
        <div className="market-page">
            <h1 className="neon-text">Market Overview 📈</h1>
            <p className="page-subtitle">Real-time market trends and analysis</p>

            <div className="market-grid">
                <MarketCard
                    title="Bitcoin (BTC)"
                    price={44200}
                    change={5.2}
                    data={bitcoinData}
                    color="#f59e0b"
                />
                <MarketCard
                    title="Ethereum (ETH)"
                    price={3100}
                    change={8.4}
                    data={ethData}
                    color="#6366f1"
                />
                <MarketCard
                    title="Solana (SOL)"
                    price={105}
                    change={-1.2}
                    data={bitcoinData} // reusing data for demo
                    color="#10b981"
                />
                <MarketCard
                    title="Cardano (ADA)"
                    price={1.2}
                    change={2.1}
                    data={ethData} // reusing data for demo
                    color="#3b82f6"
                />
            </div>

            <div className="market-analysis glass-panel">
                <h2>Market Analysis</h2>
                <p>
                    The cryptocurrency market is showing strong bullish momentum today, led by Ethereum's breakout above the $3,000 resistance level.
                    Global trading volume has increased by 15% in the last 24 hours.
                </p>
            </div>
        </div>
    );
};

export default MarketPage;
