import React, { useState } from 'react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trash2, X } from 'lucide-react';
import ThreeDCard from '../components/ThreeDCard';
import './SubscriptionsPage.css';

const SubscriptionsPage = ({ user }) => {
    const { subscriptions, loading, error: hookError, createSubscription, removeSubscription } = useSubscriptions(user?.uid);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        dueDate: '', // Day of month (1-31)
        url: '' // Optional logo/url
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        if (!formData.name || !formData.amount || !formData.dueDate) {
            setFormError("Please fill in all fields.");
            return;
        }

        try {
            await createSubscription({
                ...formData,
                amount: Number(formData.amount),
                dueDate: Number(formData.dueDate)
            });

            setFormData({ name: '', amount: '', dueDate: '', url: '' });
            setShowAddForm(false);
        } catch (err) {
            console.error("Submit error:", err);
            setFormError("Failed to save. Check your connection.");
        }
    };

    const getDaysRemaining = (dueDay) => {
        const today = new Date();
        const currentDay = today.getDate();

        if (dueDay >= currentDay) {
            return dueDay - currentDay;
        } else {
            // Due next month
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            return (daysInMonth - currentDay) + dueDay;
        }
    };

    const getProgressColor = (days) => {
        if (days <= 3) return 'bar-urgent';
        if (days <= 7) return 'bar-soon';
        return 'bar-safe';
    };

    if (loading) return <div className="p-8 text-center">Loading Subscriptions...</div>;

    return (
        <div className="subscriptions-page">
            <div className="subscriptions-header">
                <div>
                    <h1 className="page-title">Subscription Command Center</h1>
                    <p className="page-subtitle">Track and manage your recurring expenses.</p>
                </div>
                <button
                    className="btn-add-sub"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? <X size={20} /> : <Plus size={20} />}
                    {showAddForm ? 'Cancel' : 'Add Subscription'}
                </button>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.form
                        className="add-sub-form"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label>Service Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Netflix"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Monthly Cost</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Due Day (1-31)</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                placeholder="Day of month"
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-add-sub" style={{ height: '46px' }}>
                            Save
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Error Messages */}
            {(formError || hookError) && (
                <div style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                    {formError || hookError}
                </div>
            )}

            <div className="subscriptions-grid">
                <AnimatePresence>
                    {subscriptions.map((sub, index) => {
                        const daysLeft = getDaysRemaining(sub.dueDate);
                        const progress = Math.max(0, 100 - (daysLeft * 3)); // Rough progress logic

                        return (
                            <motion.div
                                key={sub.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ThreeDCard>
                                    <div className="sub-card">
                                        <div className="sub-header">
                                            <div className="flex items-center">
                                                <div className="sub-icon">
                                                    {/* Placeholder for real logo logic later */}
                                                    {sub.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="sub-info">
                                                    <h3>{sub.name}</h3>
                                                    <div className="cost">₹{sub.amount}</div>
                                                    <span className="sub-period">per month</span>
                                                </div>
                                            </div>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent card click if any
                                                    removeSubscription(sub.id);
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="days-remaining">
                                            <div className="progress-label">
                                                <span>Due in</span>
                                                <strong>{daysLeft} days</strong>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div
                                                    className={`progress-bar-fill ${getProgressColor(daysLeft)}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </ThreeDCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {subscriptions.length === 0 && !loading && (
                    <div className="no-subs">
                        <h3>No subscriptions tracked yet.</h3>
                        <p>Add your recurring bills to see them here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionsPage;
