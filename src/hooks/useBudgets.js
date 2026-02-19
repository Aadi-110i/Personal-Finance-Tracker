import { useState, useEffect } from 'react';
import {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget
} from '../services/budgetService';

export const useBudgets = (userId) => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setBudgets([]);
            setLoading(false);
            return;
        }

        const fetchBudgets = async () => {
            try {
                setLoading(true);
                const data = await getBudgets(userId);
                setBudgets(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, [userId]);

    const createBudget = async (budgetData) => {
        try {
            const docRef = await addBudget(userId, budgetData);
            const newBudget = {
                id: docRef.id,
                ...budgetData,
                userId,
                createdAt: new Date().toISOString()
            };
            setBudgets(prev => [...prev, newBudget]);
            return newBudget;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const editBudget = async (budgetId, updatedData) => {
        try {
            await updateBudget(budgetId, updatedData);
            setBudgets(prev =>
                prev.map(b => (b.id === budgetId ? { ...b, ...updatedData } : b))
            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removeBudget = async (budgetId) => {
        try {
            await deleteBudget(budgetId);
            setBudgets(prev => prev.filter(b => b.id !== budgetId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        budgets,
        loading,
        error,
        createBudget,
        editBudget,
        removeBudget
    };
};
