import { useState, useEffect } from 'react';
import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';
import { InventoryLog } from '../types';
import { OrgMembership } from '../../org/types';

export const useLog = (currentOrg: OrgMembership | null) => {
    const [recentLogs, setLogs] = useState<InventoryLog[]>([]);

    useEffect(() => {
        if (!currentOrg?.id) return;

        const unsubscribe = Repository.subscribeRecentLogs(currentOrg.id, (data) => {
            setLogs(data);
        });
        return () => unsubscribe();
    }, [currentOrg?.id]);

    const getAllLogs = async () => {
        if (!currentOrg?.id) return [];
        const allLogs = await Repository.getAllLogs(currentOrg.id);
        return allLogs;
    };

    return { recentLogs, getAllLogs };
};