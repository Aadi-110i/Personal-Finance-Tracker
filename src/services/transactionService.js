import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

const TRANSACTIONS_COLLECTION = 'transactions';

export const addTransaction = (userId, transactionData) => {
  if (!userId) {
    throw new Error("User ID is required to add transaction");
  }
  return addDoc(collection(db, TRANSACTIONS_COLLECTION), {
    ...transactionData,
    userId,
    createdAt: new Date().toISOString()
  });
};

export const getTransactions = async (userId) => {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side sorting to avoid Firestore composite index requirement
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const updateTransaction = (transactionId, updatedData) => {
  return updateDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId), updatedData);
};

export const deleteTransaction = (transactionId) => {
  return deleteDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId));
};
