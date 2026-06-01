export enum TodoStatus {
    PENDING = 'pending',
    EXECUTED = 'executed'
}

export type TodoItem = {
    productId: string;
    name: string;
    quantity: number | string;
};

export type TodoType = 'IN' | 'OUT';

type BaseTodoData = {
    status: TodoStatus;
    createdAt?: any;
    updatedAt?: any;
    executedAt?: any;
};

export type CreateTodoData = {
    title: string;
    items: TodoItem[];
    type: TodoType;
    memo?: string;
};

// Firestore에서 불러온 전체 할 일 객체 타입
export type Todo = CreateTodoData & BaseTodoData & {
    id: string;
};