import React, { useState, useEffect } from 'react';
import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';

export const useLog = (currentOrg) => {
    const [ recentLogs, setLogs] = useState([]);

    useEffect(() => {

        if (!currentOrg?.id) return;
        const unsubscribe = Repository.subscribeRecentLogs(currentOrg.id, (data) => {
            setLogs(data);
        });
        return () => unsubscribe();
    })

    const getAllLogs = async () => {
        const allLogs = await Repository.getAllLogs(currentOrg.id);

        return allLogs;
    }

    return { recentLogs, getAllLogs }
    
}