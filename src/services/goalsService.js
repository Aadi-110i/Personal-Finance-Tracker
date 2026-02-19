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

const GOALS_COLLECTION = 'goals';

export const addGoal = (userId, goalData) => {
    return addDoc(collection(db, GOALS_COLLECTION), {
        ...goalData,
        userId,
        createdAt: new Date().toISOString()
    });
};

export const getGoals = async (userId) => {
    try {
        const q = query(
            collection(db, GOALS_COLLECTION),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching goals:', error);
        return [];
    }
};

export const updateGoal = (goalId, updatedData) => {
    return updateDoc(doc(db, GOALS_COLLECTION, goalId), updatedData);
};

export const deleteGoal = (goalId) => {
    return deleteDoc(doc(db, GOALS_COLLECTION, goalId));
};
