/**
 * ProductRepository 인터페이스
 * * 이 객체는 데이터 소스(Firebase, MySQL, Mock 등)에 상관없이 
 * 애플리케이션에서 공통적으로 사용하는 데이터 접근 규격입니다.
 */
export const ProductRepository = {
  // [C/U] 제품 저장 및 수정
  saveItem: async (orgId, item, formData, initialQty) => { 
    throw new Error("saveItem: Not implemented"); 
  },

  // [U] 재고 수량 업데이트 (입고/출고/직접수정)
  updateStock: async (orgId, item, inputQty, isDirectInput, type) => { 
    throw new Error("updateStock: Not implemented"); 
  },

  // [D] 제품 삭제
  deleteItem: async (orgId, item) => { 
    throw new Error("deleteItem: Not implemented"); 
  },

  // [U] 실사 확인 기록
  auditItem: async (orgId, item) => { 
    throw new Error("auditItem: Not implemented"); 
  },

  // [R/Realtime] 제품 목록 실시간 구독
  subscribeProducts: (orgId, callback) => { 
    throw new Error("subscribeProducts: Not implemented"); 
  },

  // [R/Realtime] 최근 활동 로그 5개 실시간 구독
  subscribeRecentLogs: (orgId, callback) => { 
    throw new Error("subscribeRecentLogs: Not implemented"); 
  },

  // [R] 전체 로그 가져오기 (엑셀 다운로드용)
  getAllLogs: async (orgId) => { 
    throw new Error("getAllLogs: Not implemented"); 
  },
};