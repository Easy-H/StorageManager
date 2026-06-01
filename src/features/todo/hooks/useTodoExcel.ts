import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { Product } from '../../product/types';

export const useTodoExcel = (
    products: Product[], 
    addNewTodo: (data: any) => Promise<void>, 
    notice: (msg: string) => void
) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target?.result;
            if (!bstr) return;
            try {
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) return notice("엑셀 데이터가 비어있습니다.");

                const items = data.map((row: any) => {
                    const productName = row['상품명'] || row['Name'];
                    const matched = products.find(p => p.name === productName);
                    return {
                        productId: matched?.id || `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        name: productName,
                        quantity: Number(row['수량']) || 1,
                        isUnknown: !matched 
                    };
                }).filter(item => item.productId);

                if (items.length === 0) return notice("등록된 상품명과 일치하는 항목이 없습니다.");

                await addNewTodo({
                    title: `엑셀 업로드: ${file.name.split('.')[0]}`,
                    type: "IN",
                    items: items
                });
                notice(`${items.length}개의 품목이 등록되었습니다.`);
            } catch (err) {
                notice("엑셀 파싱 중 오류가 발생했습니다.");
            }
            e.target.value = '';
        };
        reader.readAsBinaryString(file as any);
    };

    return { fileInputRef, handleFileChange };
};