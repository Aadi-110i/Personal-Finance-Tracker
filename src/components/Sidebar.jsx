import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    PieChart,
    Target,
    CreditCard,
    FileText,
    Calendar,
    LogOut,
    User,
    Settings,
    Wallet
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
    const location = useLocation();

    const navItems = user
        ? [
            { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/budget', icon: PieChart, label: 'Budget' },
            { path: '/goals', icon: Target, label: 'Goals' },
            { path: '/transactions', icon: CreditCard, label: 'Transactions' },
            { path: '/reports', icon: FileText, label: 'Reports' },
            { path: '/subscriptions', icon: Calendar, label: 'Subscriptions' },
        ]
        : [
            { path: '/', icon: LayoutDashboard, label: 'Home' },
            { path: '/login', icon: User, label: 'Login' },
            { path: '/register', icon: User, label: 'Register' },
        ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon"><Wallet className="text-purple-400" size={28} /></div>
                    <span className="logo-text">FinanceTracker</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {user && (
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        <div className="user-info">
                            <p className="user-name">{user.displayName || 'User'}</p>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
