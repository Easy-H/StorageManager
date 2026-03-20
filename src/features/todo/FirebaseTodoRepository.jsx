// common/api/firebase/TodoRepository.js
import { db } from '../../common/api/firebase/firebase.js';
import { collection, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export const FirebaseTodoRepository = {
    // [C] 할 일 등록 (수동 또는 엑셀)
    addTodo: async (orgId, todoData) => {
        const colRef = collection(db, "organizations", orgId, "todos");
        console.log(todoData);
        return await addDoc(colRef, {
            ...todoData,
            status: 'pending',
            createdAt: serverTimestamp(),
        });
    },
    updateTodo: async (orgId, todoId, updatedData) => {
        try {
            const todoRef = doc(db, "organizations", orgId, "todos", todoId);
            await updateDoc(todoRef, {
                ...updatedData,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("수정 실패:", error);
            throw error;
        }
    },

  // [D] 할 일 삭제
  deleteTodo: async (orgId, todoId) => {
        const docRef = doc(db, "organizations", orgId, "todos", todoId);
        await deleteDoc(docRef);
    }
};