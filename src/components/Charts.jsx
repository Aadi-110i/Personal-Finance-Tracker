import React, { useState } from 'react';
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
  Area,
  Sector
} from 'recharts';
import './Charts.css';

const COLORS = ['#a855f7', '#ec4899', '#06b6d4', '#34d399', '#f59e0b', '#ef4444'];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#fff" style={{ fontSize: '1.2rem', fontWeight: 'bold', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' }}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 10px ${fill})` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const Charts = ({ transactions }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

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

  // const COLORS = [
  //   '#7c3aed', // primary-glow
  //   '#ec4899', // secondary-glow
  //   '#06b6d4', // accent-cyan
  //   '#10b981', // success
  //   '#f59e0b', // warning
  //   '#ef4444', // danger
  //   '#8b5cf6',
  //   '#f97316',
  // ];

  // const expenseData = getExpensesByCategory();
  // const incomeData = getIncomeByCategory();
  // const monthlyData = getMonthlyTotals();
  // const healthData = calculateFinancialHealth();

  // const tooltipStyle = {
  //   backgroundColor: 'rgba(20, 20, 35, 0.9)',
  //   border: '1px solid rgba(255, 255, 255, 0.1)',
  //   borderRadius: '0.75rem',
  //   color: '#fff',
  //   backdropFilter: 'blur(4px)'
  // };

  return (
    <div className="charts-container" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '2rem',
      width: '100%'
    }}>
      {/* Financial Trend - Area Chart */}
      {getMonthlyTotals().length > 0 && (
        <div className="chart-card">
          <h3 className="neon-text text-xl font-semibold mb-6 flex items-center justify-center gap-2 text-center" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            Financial Breakdown
          </h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMonthlyTotals()} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} verticalAlign="bottom" align="center" />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#34d399"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expenses"
                  fill="#f87171"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Spending Breakdown - Donut Chart */}
      {getExpensesByCategory().length > 0 && (
        <div className="chart-card">
          <h3 className="neon-text text-xl font-semibold mb-6 flex items-center justify-center gap-2 text-center" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            Spending Breakdown
          </h3>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={getExpensesByCategory()}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={onPieEnter}
                >
                  {getExpensesByCategory().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={activeIndex === index ? '#fff' : 'none'} strokeWidth={2} />
                  ))}
                </Pie>
                {/* Custom tooltip hidden when active shape is shown to avoid clutter, or keep it. Let's keep it but minimal. */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `₹${value.toFixed(2)}`}
                />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
