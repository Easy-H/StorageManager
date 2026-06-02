import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../../../common/api/firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FirebaseInventoryRepository as InventoryAPI } from '../../product/api/FirebaseInventoryRepository';
import { FirebaseTodoRepository as TodoAPI } from '../api/FirebaseTodoRepository';
import { Todo, CreateTodoData } from '../types';

type TodoContextType = {
	todos: Todo[];
	loading: boolean;
	deleteTodo: (todoId: string) => Promise<void>;
	addNewTodo: (newTodoData: CreateTodoData) => Promise<void>;
	updateTodo: (todoId: string, updatedData: Partial<CreateTodoData>) => Promise<void>;
	executeTodo: (todo: Todo) => Promise<void>;
	undoTodo: (todo: Todo) => Promise<void>;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
	orgId?: string;
	notice: (message: string) => void;
	children: ReactNode;
}

export const TodoProvider = ({ orgId, notice, children }: TodoProviderProps) => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [loading, setLoading] = useState(true);

	/**
	 * [R] 실시간 할 일 목록 구독
	 * Firestore의 Timestamp를 JavaScript Date 객체로 변환하여 
	 * 외부 의존성을 낮춘 Todo 타입을 유지합니다.
	 */
	// 1. 실시간 할 일 목록 구독
	useEffect(() => {
		if (!orgId) {
			setTodos([]);
			setLoading(false);
			return;
		}

		const q = collection(db, "organizations", orgId, 'todos');

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const todoList = snapshot.docs.map(doc => {
				const data = doc.data();
				return {
					id: doc.id,
					...data,
					createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
					updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
					executedAt: data.executedAt?.toDate ? data.executedAt.toDate() : data.executedAt,
				} as unknown as Todo;
			});
			setTodos(todoList);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [orgId]);

	const deleteTodo = async (todoId: string) => {
		if (!orgId) return;
		await TodoAPI.deleteTodo(orgId, todoId);
	};

	const addNewTodo = async (newTodoData: CreateTodoData) => {
		if (!orgId) return;
		try {
			await TodoAPI.addTodo(orgId, newTodoData);
			console.log("할 일이 등록되었습니다.");
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			console.log(errorMessage);
			notice("등록 실패: " + errorMessage);
			throw e;
		}
	};

	const updateTodo = async (todoId: string, updatedData: Partial<CreateTodoData>) => {
		if (!orgId) return;
		await TodoAPI.updateTodo(orgId, todoId, updatedData);
	};

	const executeTodo = async (todo: Todo) => {
		try {
			if (!orgId) return;
			setLoading(true);

			// 개별 호출 대신 일괄(Batch) 처리 메서드 호출
			await InventoryAPI.updateStocks(
				orgId,
				todo.items,
				todo.type,
				todo.id
			);

			console.log("일괄 재고 반영 완료");
		} catch (error) {
			console.error("할 일 실행 중 오류 발생:", error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			notice("재고 반영 중 오류가 발생했습니다: " + errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const undoTodo = async (todo: Todo) => {
		try {
			if (!orgId) return;
			// 이미 실행된 상태인지 한 번 더 체크 (방어적 코드)
			if (todo.status !== 'executed') {
				throw new Error("이미 대기 중이거나 실행되지 않은 항목입니다.");
			}

			await InventoryAPI.undoStocks(
				orgId,
				todo.items,
				todo.type, // 원래의 타입(IN/OUT)을 넘겨줌
				todo.id
			);

			console.log("실행 취소 및 재고 원복(Batch) 완료");
		} catch (error) {
			console.error("실행 취소 중 오류 발생:", error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			notice("취소 처리 중 오류가 발생했습니다: " + errorMessage);
		}
	};

	return (
		<TodoContext.Provider value={{
			todos, loading,
			deleteTodo, executeTodo, addNewTodo, updateTodo, undoTodo
		}}>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodos = () => {
	const context = useContext(TodoContext);
	if (context === undefined) {
		throw new Error('useTodos must be used within a TodoProvider');
	}
	return context;
};