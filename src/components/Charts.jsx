import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area
} from 'recharts';
import './Charts.css';

const Charts = ({ transactions }) => {
  const getCategoryTotals = () => {
    const totals = {};
    transactions.forEach(t => {
      if (!totals[t.category]) {
        totals[t.category] = { name: t.category, value: 0, type: t.type };
      }
      totals[t.category].value += parseFloat(t.amount);
    });
    return Object.values(totals);
  };

  const getMonthlyTotals = () => {
    const monthlyData = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        monthlyData[monthKey].income += parseFloat(t.amount);
      } else {
        monthlyData[monthKey].expense += parseFloat(t.amount);
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  };

  const getExpensesByCategory = () => {
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryTotals[t.category]) {
          categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += parseFloat(t.amount);
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const getIncomeByCategory = () => {
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        if (!categoryTotals[t.category]) {
          categoryTotals[t.category] = 0;
        }
        categoryTotals[t.category] += parseFloat(t.amount);
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const calculateFinancialHealth = () => {
    // Dummy calculation for demonstration
    // Real logic would calculate these scores based on transactions
    return [
      { subject: 'Savings', A: 120, fullMark: 150 },
      { subject: 'Expenses', A: 98, fullMark: 150 },
      { subject: 'Investments', A: 86, fullMark: 150 },
      { subject: 'Debt', A: 99, fullMark: 150 },
      { subject: 'Budget', A: 85, fullMark: 150 },
      { subject: 'Goals', A: 65, fullMark: 150 },
    ];
  };

  const COLORS = [
    '#7c3aed', // primary-glow
    '#ec4899', // secondary-glow
    '#06b6d4', // accent-cyan
    '#10b981', // success
    '#f59e0b', // warning
    '#ef4444', // danger
    '#8b5cf6',
    '#f97316',
  ];

  const expenseData = getExpensesByCategory();
  const incomeData = getIncomeByCategory();
  const monthlyData = getMonthlyTotals();
  const healthData = calculateFinancialHealth();

  const tooltipStyle = {
    backgroundColor: 'rgba(20, 20, 35, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    color: '#fff',
    backdropFilter: 'blur(4px)'
  };

  return (
    <div className="charts-container">
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Financial Health Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={healthData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="rgba(255,255,255,0.1)" />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#7c3aed"
                strokeWidth={3}
                fill="#7c3aed"
                fillOpacity={0.3}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {expenseData.length > 0 && (
          <div className="chart-card">
            <h3>Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={tooltipStyle}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {monthlyData.length > 0 && (
        <div className="chart-card full-width">
          <h3>Activity Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={tooltipStyle}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorExpense)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Charts;
