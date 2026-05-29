import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';
import { Product } from '../types';

type NoticeFunction = (message: string) => void;

export const useProductActions = (
  orgId: string, 
  notice: NoticeFunction, 
  onClose: () => void
) => {
  const saveItem = async (itemId: string | null, formData: any, initialQty?: number | string) => {
    try {
      await Repository.saveItem(orgId, itemId, formData, initialQty);
      onClose();
    } catch (e) {
      console.log(e);
      notice("저장 실패");
    }
  };

  const updateStock = async (item: Product, inputQty: number | string, isDirectInput: boolean, type: string) => {
    try {
      await Repository.updateStock(orgId, item.id, inputQty, isDirectInput, type);
      notice("업데이트 완료");
      onClose();
    } catch (e) { console.log(e);notice("업데이트 실패"); }
  };

  const deleteItem = async (item: Product) => {
    try {
      await Repository.deleteItem(orgId, item.id);
      notice("삭제 완료");
      onClose();
    } catch (e) { notice("삭제 실패"); }
  };

  const auditItem = async (item: Product) => {
    if (!window.confirm("현재 수량이 실제 재고와 일치함을 확인하셨습니까?")) return;
    try {
      await Repository.auditItem(orgId, item.id);

      notice("실사 확인이 완료되었습니다.");
    } catch (e) {
      console.log(e);
      notice("업데이트 실패");
    }
  };

  return { saveItem, updateStock, deleteItem, auditItem };
};