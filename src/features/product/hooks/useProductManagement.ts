import { useState, useMemo } from 'react';
import Hangul from 'hangul-js';
import { getAuditStatus } from '../utils/auditUtils';
import { Product } from '../types';

export type FilterType = string;

interface FilterCounts {
    ALL: number;
    LOW_STOCK: number;
    NEEDS_INSPECTION: number;
    NEEDS_AUDIT: number;
}

/**
 * 제품 리스트의 검색, 필터링, 정렬을 통합 관리하는 훅
 */
export const useProductManagement = (products: Product[], searchTerm: string) => {
    const [sortBy, setSortBy] = useState<string>("name");
    const [filterType, setFilterType] = useState<FilterType>("ALL");

    // 1. 검색어 필터링 (Hangul-js 초성 검색 포함)
    const searchResult = useMemo<Product[]>(() => {
        const searchKeyword = searchTerm.toLowerCase().trim();
        if (!searchKeyword) return products;

        return products.filter(p => {
            const name = (p.name || "").toLowerCase();
            const barcode = (p.barcode || "").toLowerCase();

            // 바코드 검색
            if (barcode.includes(searchKeyword)) return true;

            // 일반 검색 (부분 일치)
            if (Hangul.search(name, searchKeyword) !== -1) return true;

            // 초성 검색 (검색어가 자음으로만 구성된 경우)
            const isChoseongQuery = searchKeyword.split('').every(char => Hangul.isConsonant(char) && !Hangul.isVowel(char));
            if (isChoseongQuery) {
                const choseongName = (Hangul.disassemble(name, true) as string[][])
                    .map(group => group[0])
                    .join('');
                return choseongName.includes(searchKeyword);
            }

            return false;
        });
    }, [products, searchTerm]);

    // 2. 검색된 결과 내에서 각 카테고리별 개수 계산
    const counts = useMemo<FilterCounts>(() => ({
        ALL: searchResult.length,
        LOW_STOCK: searchResult.filter(p => p.currentStock <= (p.safetyStock || 0)).length,
        NEEDS_INSPECTION: searchResult.filter(p => getAuditStatus(p.lastAudit).needsInspection).length,
        NEEDS_AUDIT: searchResult.filter(p => getAuditStatus(p.lastAudit).needsAudit).length,
    }), [searchResult]);

    // 3. 상태 필터링 및 정렬 적용
    const displayList = useMemo<Product[]>(() => {
        let list = searchResult.filter(p => {
            if (filterType === "LOW_STOCK") return p.currentStock <= (p.safetyStock || 0);
            if (filterType === "NEEDS_AUDIT") return getAuditStatus(p.lastAudit).needsAudit;
            if (filterType === "NEEDS_INSPECTION") return getAuditStatus(p.lastAudit).needsInspection;
            return true;
        });

        return list.sort((a, b) => {
            if (sortBy === "lowStock") {
                const aGap = a.currentStock - (a.safetyStock || 0);
                const bGap = b.currentStock - (b.safetyStock || 0);
                return aGap - bGap;
            }
            if (sortBy === "oldAudit") {
                const aTime = a.lastAudit ? new Date(a.lastAudit).getTime() : 0;
                const bTime = b.lastAudit ? new Date(b.lastAudit).getTime() : 0;
                return aTime - bTime;
            }
            return a.name.localeCompare(b.name);
        });
    }, [searchResult, filterType, sortBy]);

    return {
        displayList,
        counts,
        sortBy, setSortBy,
        filterType, setFilterType
    };
};