import { db } from '../config/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs
} from 'firebase/firestore';

const COLLECTION_NAME = 'subscriptions';

export const addSubscription = async (userId, subscriptionData) => {
    if (!userId) {
        console.error("Attempted to add subscription without userId");
        throw new Error("User ID is required to add subscription");
    }

    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            userId,
            ...subscriptionData,
            createdAt: new Date().toISOString()
        });
        console.log("Subscription added successfully:", docRef.id);
        return { id: docRef.id, ...subscriptionData };
    } catch (error) {
        console.error("Error adding subscription: ", error);
        throw error;
    }
};

export const updateSubscription = async (id, updatedData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updatedData);
        return { id, ...updatedData };
    } catch (error) {
        console.error("Error updating subscription: ", error);
        throw error;
    }
};

export const deleteSubscription = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        return id;
    } catch (error) {
        console.error("Error deleting subscription: ", error);
        throw error;
    }
};

export const getSubscriptions = async (userId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching subscriptions: ", error);
        throw error;
    }
};
