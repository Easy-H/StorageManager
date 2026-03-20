// src/hooks/useProductActions.js
import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';

export const useProductActions = (orgId, notice, onClose) => {

  const saveItem = async (item, formData, initialQty) => {
    try {
      await Repository.saveItem(orgId, item.id, formData, initialQty);
      onClose();
    } catch (e) {
      notice("저장 실패");
    }
  };

  const updateStock = async (item, inputQty, isDirectInput, type) => {
    try {
      await Repository.updateStock(orgId, item.id, inputQty, isDirectInput, type);
      notice("업데이트 완료");
      onClose();
    } catch (e) { console.log(e);notice("업데이트 실패"); }
  };

  const deleteItem = async (item) => {
    try {
      await Repository.deleteItem(orgId, item.id);
      notice("삭제 완료");
      onClose();
    } catch (e) { notice("삭제 실패"); }
  };

  const auditItem = async (item) => {
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