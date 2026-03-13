// src/hooks/useProductActions.js
import { FirebaseProductRepository as Repository } from '../api/FirebaseProductRepository';

export const useProductActions = (orgId, notice, onClose) => {
  
  const saveItem = async (item, formData, initialQty) => {
    try {
      await Repository.saveItem(orgId, item, formData, initialQty);
      onClose();
    } catch (e) {
        notice("저장 실패");
    }
  };

  const updateStock = async (item, inputQty, isDirectInput, type) => {
    try {
      await Repository.updateStock(orgId, item, inputQty, isDirectInput, type);
      notice("업데이트 완료");
      onClose();
    } catch (e) { notice("업데이트 실패"); }
  };

  const deleteItem = async (item) => {
    try {
      await Repository.deleteItem(orgId, item);
      notice("삭제 완료");
      onClose();
    } catch (e) { notice("삭제 실패"); }
  };

  return { saveItem, updateStock, deleteItem };
};