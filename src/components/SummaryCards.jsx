import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import './SummaryCards.css';

const SummaryCards = ({ transactions }) => {
  const calculateTotals = () => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount) || 0;
      if (transaction.type === 'income') {
        income += amount;
      } else {
        expenses += amount;
      }
    });

    const balance = income - expenses;

    return {
      balance: balance.toFixed(2),
      income: income.toFixed(2),
      expenses: expenses.toFixed(2)
    };
  };

  const { balance, income, expenses } = calculateTotals();

  // Generate dummy chart data based on totals (for visual effect)
  // In a real app, this would be historical data
  const generateChartData = (baseValue, volatility, trend) => {
    const data = [];
    let currentValue = baseValue * 0.8; // Start slightly lower
    for (let i = 0; i < 10; i++) {
      const change = (Math.random() - 0.5) * volatility;
      currentValue += change + trend;
      if (currentValue < 0) currentValue = 0;
      data.push({ value: currentValue });
    }
    // Ensure last point matches current trend direction nicely
    data.push({ value: baseValue });
    return data;
  };

  const balanceData = generateChartData(parseFloat(balance), 200, 50);
  const incomeData = generateChartData(parseFloat(income), 100, 20);
  const expenseData = generateChartData(parseFloat(expenses), 50, 10);

  const Card = ({ title, amount, subtitle, icon: Icon, type, data, color }) => {
    // 3D Tilt Logic
    const [transform, setTransform] = useState('');

    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
      const rotateY = ((x - centerX) / centerX) * 10;

      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    };

    const handleMouseLeave = () => {
      setTransform('perspective(1000px) rotateX(0) rotateY(0) scale(1)');
    };

    return (
      <div
        className={`summary-card ${type}-card`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform, transition: transform ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out' }}
      >
        <div className="card-content">
          <div className="card-header-summary">
            <h3>{title}</h3>
            <Icon className="card-icon" size={28} />
          </div>
          <div className="card-main">
            <p className="card-amount">${amount}</p>
            <div className="card-chart">
              <ResponsiveContainer width="100%" height={50}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    fill={`url(#gradient-${type})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <span className="card-description">{subtitle}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="summary-cards">
      <Card
        title="Total Balance"
        amount={balance}
        subtitle="Current Balance"
        icon={Wallet}
        type="balance"
        data={balanceData}
        color="#a78bfa"
      />
      <Card
        title="Income"
        amount={income}
        subtitle="Total Income"
        icon={TrendingUp}
        type="income"
        data={incomeData}
        color="#34d399"
      />
      <Card
        title="Expenses"
        amount={expenses}
        subtitle="Total Expenses"
        icon={TrendingDown}
        type="expense"
        data={expenseData}
        color="#f87171"
      />
    </div>
  );
};

export default SummaryCards;
