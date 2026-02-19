import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';

const BUDGETS_COLLECTION = 'budgets';

export const addBudget = (userId, budgetData) => {
    if (!userId) {
        throw new Error("User ID is required to add budget");
    }
    return addDoc(collection(db, BUDGETS_COLLECTION), {
        ...budgetData,
        userId,
        createdAt: new Date().toISOString()
    });
};

export const getBudgets = async (userId) => {
    try {
        const q = query(
            collection(db, BUDGETS_COLLECTION),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching budgets:', error);
        return [];
    }
};

export const updateBudget = (budgetId, updatedData) => {
    return updateDoc(doc(db, BUDGETS_COLLECTION, budgetId), updatedData);
};

export const deleteBudget = (budgetId) => {
    return deleteDoc(doc(db, BUDGETS_COLLECTION, budgetId));
};
