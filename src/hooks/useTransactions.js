import { useState, useEffect } from 'react';
import {
  addTransaction,
  updateTransaction,
  deleteTransaction
} from '../services/transactionService';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for transactions
  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Create query
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId)
      // Note: If you want server-side sorting, you need a composite index in Firestore.
      // For now, we'll sort client-side to avoid index creation errors.
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Client-side sorting (newest first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching transactions:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const createTransaction = async (transactionData) => {
    try {
      await addTransaction(userId, transactionData);
      // No need to manually update state, the listener will handle it!
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editTransaction = async (transactionId, updatedData) => {
    try {
      await updateTransaction(transactionId, updatedData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
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
