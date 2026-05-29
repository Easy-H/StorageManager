import { StockUpdateItem, StockUpdateType, TodoStatus } from '../product/types';

export type Todo = {
  id: string;
  status: TodoStatus;
  items: StockUpdateItem[];
  type: StockUpdateType;
  createdAt: Date;
  updatedAt?: Date;
  executedAt?: Date | null;
  // 추가 필드 (예: 메모, 제목 등)
  [key: string]: any;
};

/**
 * 할 일 생성을 위한 데이터 타입 (자동 생성 필드 제외)
 */
export type CreateTodoData = Omit<Todo, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'executedAt'>;