import { useState, useEffect } from 'react';
import {
    addSubscription,
    updateSubscription,
    deleteSubscription
} from '../services/subscriptionService';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useSubscriptions = (userId) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setSubscriptions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(
            collection(db, 'subscriptions'),
            where('userId', '==', userId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSubscriptions(data);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching subscriptions:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const createSubscription = async (data) => {
        try {
            await addSubscription(userId, data);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removeSubscription = async (id) => {
        try {
            await deleteSubscription(id);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        subscriptions,
        loading,
        error,
        createSubscription,
        removeSubscription
    };
};
