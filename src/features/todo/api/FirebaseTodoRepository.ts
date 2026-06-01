import { db } from '../../../common/api/firebase/firebase';
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    updateDoc, 
    doc, 
    deleteDoc,
    DocumentReference 
} from 'firebase/firestore';
import { CreateTodoData, TodoStatus, Todo } from '../types';

export const FirebaseTodoRepository = {
    // [C] 할 일 등록 (수동 또는 엑셀)
    addTodo: async (orgId: string, todoData: CreateTodoData): Promise<DocumentReference> => {
        const colRef = collection(db, "organizations", orgId, "todos");
        return await addDoc(colRef, {
            ...todoData,
            status: TodoStatus.PENDING,
            createdAt: serverTimestamp(),
        });
    },

    updateTodo: async (orgId: string, todoId: string, updatedData: Partial<Todo>): Promise<void> => {
        const todoRef = doc(db, "organizations", orgId, "todos", todoId);
        await updateDoc(todoRef, {
            ...updatedData,
            updatedAt: serverTimestamp(),
        });
    },

    // [D] 할 일 삭제
    deleteTodo: async (orgId: string, todoId: string): Promise<void> => {
        const docRef = doc(db, "organizations", orgId, "todos", todoId);
        await deleteDoc(docRef);
    }
};