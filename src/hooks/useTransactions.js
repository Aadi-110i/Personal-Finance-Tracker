import { useState, useEffect } from 'react';
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../services/transactionService';

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions on mount and when userId changes
  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions(userId);
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const createTransaction = async (transactionData) => {
    try {
      const docRef = await addTransaction(userId, transactionData);
      const newTransaction = {
        id: docRef.id,
        ...transactionData,
        userId,
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editTransaction = async (transactionId, updatedData) => {
    try {
      await updateTransaction(transactionId, updatedData);
      setTransactions(prev =>
        prev.map(t => (t.id === transactionId ? { ...t, ...updatedData } : t))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    createTransaction,
    editTransaction,
    removeTransaction
  };
};
