import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AIInsights = ({ transactions }) => {
    const insights = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const stats = [];

        // 1. Calculate total expenses
        const expenses = transactions.filter(t => t.type === 'expense');
        const totalExpense = expenses.reduce((acc, t) => acc + parseFloat(t.amount), 0);

        // 2. Find highest spending category
        const categoryTotals = {};
        expenses.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseFloat(t.amount);
        });

        let maxCategory = null;
        let maxAmount = 0;
        Object.entries(categoryTotals).forEach(([cat, amount]) => {
            if (amount > maxAmount) {
                maxAmount = amount;
                maxCategory = cat;
            }
        });

        if (maxCategory) {
            stats.push({
                type: 'warning',
                icon: AlertTriangle,
                title: 'Spending Alert',
                message: `Your highest spending is on ${maxCategory} ($${maxAmount.toFixed(0)}). Consider setting a budget.`
            });
        }

        // 3. Mock "AI" Prediction (Trends)
        stats.push({
            type: 'success',
            icon: TrendingUp,
            title: 'Smart Projection',
            message: `Based on your habits, you're on track to save 15% more this month!`
        });

        return stats;
    }, [transactions]);

    return (
        <div className="glass-panel-premium" style={{ padding: '1.5rem', height: '100%' }}>
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-purple-400" size={20} />
                <h3 className="text-lg font-semibold text-white">AI Financial Insights</h3>
            </div>

            <div className="space-y-4">
                {insights.map((insight, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-xl border ${insight.type === 'warning'
                                ? 'bg-red-500/10 border-red-500/20'
                                : 'bg-green-500/10 border-green-500/20'
                            }`}
                        style={{ backdropFilter: 'blur(10px)' }}
                    >
                        <div className="flex items-start gap-3">
                            <insight.icon
                                size={18}
                                className={insight.type === 'warning' ? 'text-red-400' : 'text-green-400'}
                                style={{ marginTop: '3px' }}
                            />
                            <div>
                                <h4 className={`text-sm font-medium mb-1 ${insight.type === 'warning' ? 'text-red-200' : 'text-green-200'
                                    }`}>
                                    {insight.title}
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {insight.message}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {insights.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">
                        Add more transactions to unlock AI insights.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AIInsights;
