import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { Plus, Trash2, CheckCircle, Clock, Target, Shield, Plane, Laptop, Car, Home, GraduationCap, Dumbbell, Book, Palette, Watch, Briefcase, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGoals } from '../hooks/useGoals';
import './GoalsPage.css';

const GoalsPage = ({ user }) => {
  const { goals, loading, createGoal, editGoal, removeGoal } = useGoals(user?.uid);

  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    icon: 'Target'
  });

  const iconMap = {
    Target: Target,
    Shield: Shield,
    Plane: Plane,
    Laptop: Laptop,
    Car: Car,
    Home: Home,
    GraduationCap: GraduationCap,
    Dumbbell: Dumbbell,
    Book: Book,
    Palette: Palette,
    Watch: Watch,
    Heart: Heart
  };

  const icons = Object.keys(iconMap);

  const handleAddGoal = async () => {
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      try {
        await createGoal({
          name: newGoal.name,
          target: parseFloat(newGoal.target),
          current: parseFloat(newGoal.current) || 0,
          deadline: newGoal.deadline,
          icon: newGoal.icon
        });
        setNewGoal({ name: '', target: '', current: '', deadline: '', icon: 'Target' });
        setShowForm(false);
      } catch (error) {
        console.error("Error adding goal:", error);
      }
    }
  };

  const handleUpdateGoal = async (id, current, target) => {
    try {
      await editGoal(id, { current: Math.min(parseFloat(current), target) });
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await removeGoal(id);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const target = new Date(deadline);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getTotalStats = () => {
    if (!goals || !goals.length) return { total: 0, saved: 0, progress: 0 };
    const total = goals.reduce((sum, g) => sum + g.target, 0);
    const saved = goals.reduce((sum, g) => sum + g.current, 0);
    return { total, saved, progress: total > 0 ? (saved / total) * 100 : 0 };
  };

  const stats = getTotalStats();

  const chartData = goals.map(g => ({
    name: g.name,
    Target: g.target,
    Saved: g.current,
    amt: g.target
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // If waiting for initial load, show simpler loading state or return null
  if (loading && goals.length === 0) {
    // Optional: You can return a spinner here
  }

  return (
    <div className="goals-page">
      <motion.div
        className="goals-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="neon-text">Financial Goals</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your savings goals and stay motivated</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> Add Goal
        </button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="goals-stats"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon"><Target size={24} /></div>
          <p className="stat-label">Total Goal Target</p>
          <p className="stat-value">₹{stats.total.toFixed(0)}</p>
        </motion.div>

        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon"><Shield size={24} /></div>
          <p className="stat-label">Total Saved</p>
          <p className="stat-value">₹{stats.saved.toFixed(0)}</p>
        </motion.div>

        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon"><CheckCircle size={24} /></div>
          <p className="stat-label">Overall Progress</p>
          <p className="stat-value">{Math.round(stats.progress)}%</p>
        </motion.div>

        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon"><Target size={24} /></div>
          <p className="stat-label">Active Goals</p>
          <p className="stat-value">{goals.length}</p>
        </motion.div>
      </motion.div>

      {/* Add Goal Form */}
      {showForm && (
        <motion.div
          className="add-goal-form glass-panel-premium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="form-section">
            <h3>Create New Goal</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Goal Name *</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Summer Vacation"
                />
              </div>

              <div className="form-group">
                <label>Target Amount (₹) *</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Current Savings (₹)</label>
                <input
                  type="number"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Target Deadline *</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Icon</label>
                <div className="icon-picker">
                  {icons.map((iconKey) => {
                    const IconComponent = iconMap[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        className={`icon-option ${newGoal.icon === iconKey ? 'selected' : ''}`}
                        onClick={() => setNewGoal({ ...newGoal, icon: iconKey })}
                      >
                        <IconComponent size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', gridColumn: '1 / -1', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={handleAddGoal}>Create Goal</button>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Goals List - Refactored to match Transaction History */}
      <div
        className="goals-list-container"
      >
        <div className="list-header glass-panel p-4 mb-4 flex items-center text-secondary text-sm font-medium">
          <div style={{ width: '40%' }}>Goal Details</div>
          <div style={{ width: '40%', textAlign: 'center' }}>Progress</div>
          <div style={{ width: '20%', textAlign: 'right', paddingRight: '1rem' }}>Actions</div>
        </div>

        {goals.length === 0 ? (
          <div className="glass-panel p-8 text-center text-gray-500 italic">
            No active goals found. Start by creating a new goal!
          </div>
        ) : (
          goals.slice(-3).reverse().map((goal, index) => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const daysLeft = calculateDaysLeft(goal.deadline);
            const isCompleted = goal.current >= goal.target;
            const isOverdue = daysLeft < 0;
            const IconComponent = iconMap[goal.icon] || Target;

            return (
              <motion.div
                key={goal.id}
                className={`goal-row glass-panel hover-glow ${isCompleted ? 'completed' : ''}`}
                variants={itemVariants}
                layout
              >
                {/* Left: Icon + Name + Target */}
                <div className="goal-left-section">
                  <div className={`goal-icon-box ${isCompleted ? 'completed' : ''}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="goal-info">
                    <h4>{goal.name}</h4>
                    <span className="goal-meta">
                      <Target size={12} /> Target: ₹{goal.target.toLocaleString()}
                    </span>
                    <span className={`goal-meta ${isOverdue ? 'text-rose-400' : ''}`}>
                      <Clock size={12} /> {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </span>
                  </div>
                </div>

                {/* Center: Progress Bar */}
                <div className="goal-center-section">
                  <div className="progress-container">
                    <div className="progress-bar-row">
                      <div
                        className={`progress-fill ${isCompleted ? 'completed' : ''}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <span className="progress-text">{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Right: Current + Actions */}
                <div className="goal-right-section">
                  <div className="current-amount">
                    <span className="label">Saved:</span>
                    <span className="value">₹{goal.current.toLocaleString()}</span>
                  </div>

                  <div className="goal-actions-row">
                    <div className="quick-add">
                      <input
                        type="number"
                        placeholder="+ Add"
                        min="0"
                        className="quick-add-input"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            handleUpdateGoal(goal.id, goal.current + parseFloat(e.target.value), goal.target);
                            e.target.value = '';
                          }
                        }}
                        disabled={isCompleted}
                      />
                    </div>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteGoal(goal.id)}
                      title="Delete Goal"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          }))}
      </div>

      {/* Goals Chart - Moved After Grid */}
      {
        goals.length > 0 && (
          <motion.div
            className="glass-panel-premium"
            style={{ marginBottom: '3rem', padding: '2rem', marginTop: '3rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Goals Overview</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e1b4b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Saved" stroke="#8884d8" strokeWidth={3} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Target" stroke="#82ca9d" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 6, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )
      }

      {
        !loading && goals.length === 0 && (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon"><Target size={48} /></div>
            <h2>No Goals Yet</h2>
            <p>Start by creating your first financial goal to track your progress</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} /> Create Your First Goal
            </button>
          </motion.div>
        )
      }
    </div >
  );
};

export default GoalsPage;
