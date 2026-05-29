import Hangul from 'hangul-js';
import { Product } from '../types';

export function useProductSearch(products: Product[], keyword: string) {
    const searchKeyword = keyword.toLowerCase().trim();
    const searchResult = products.filter(p => {
        const name = (p.name || "").toLowerCase();
        const barcode = (p.barcode || "").toLowerCase();

        // 1. 바코드 숫자에 키워드가 포함되는지 확인
        if (barcode.includes(searchKeyword)) return true;

        // 2. 일반 검색 (부분 일치: '크리' -> '클린')
        if (Hangul.search(name, searchKeyword) !== -1) return true;

        // 3. 초성 검색 (초성만 입력했을 때: 'ㅋㄹ' -> '클린')
        // 검색어 자체가 초성으로만 이루어져 있는지 확인
        const isChoseongQuery = searchKeyword.split('').every(char => Hangul.isConsonant(char) && !Hangul.isVowel(char));

        if (isChoseongQuery) {
            // 제품명에서 초성만 추출 (예: '클린' -> 'ㅋㄹ')
            const choseongName = Hangul.disassemble(name, true).map(group => group[0]).join('');
            return choseongName.includes(searchKeyword);
        }

        return false;
    });

    return { searchResult };
}