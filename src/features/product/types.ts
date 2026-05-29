export type Product = {
  id: string;
  name: string;
  currentStock: number;
  createdAt: Date;
  updatedAt: Date;
  lastAudit?: Date;
  // 카테고리, 단위 등 추가 필드
  [key: string]: any;
};

export type InventoryLog = {
  id: string;
  productId: string;
  productName: string;
  type: string; // 'IN', 'OUT', 'UNDO_IN', 'UNDO_OUT' 등
  changeQty: number;
  finalStock: number;
  timestamp: Date;
  userEmail?: string;
  todoId?: string;
  isUndo?: boolean;
};

export type StockUpdateItem = {
  productId: string;
  name: string;
  quantity: number | string;
};

export type StockUpdateType = 'IN' | 'OUT';

export type TodoStatus = 'pending' | 'executed';

export type Todo = {
  id: string;
  status: TodoStatus;
  items: StockUpdateItem[];
  type: StockUpdateType;
  executedAt?: Date | null;
};