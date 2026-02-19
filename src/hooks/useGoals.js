import { useState, useEffect } from 'react';
import {
    addGoal,
    getGoals,
    updateGoal,
    deleteGoal
} from '../services/goalsService';

export const useGoals = (userId) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setGoals([]);
            setLoading(false);
            return;
        }

        const fetchGoals = async () => {
            try {
                setLoading(true);
                const data = await getGoals(userId);
                setGoals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [userId]);

    const createGoal = async (goalData) => {
        try {
            const docRef = await addGoal(userId, goalData);
            const newGoal = {
                id: docRef.id,
                ...goalData,
                userId,
                createdAt: new Date().toISOString()
            };
            setGoals(prev => [...prev, newGoal]);
            return newGoal;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const editGoal = async (goalId, updatedData) => {
        try {
            await updateGoal(goalId, updatedData);
            setGoals(prev =>
                prev.map(g => (g.id === goalId ? { ...g, ...updatedData } : g))
            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removeGoal = async (goalId) => {
        try {
            await deleteGoal(goalId);
            setGoals(prev => prev.filter(g => g.id !== goalId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        goals,
        loading,
        error,
        createGoal,
        editGoal,
        removeGoal
    };
};
