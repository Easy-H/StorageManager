import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../../common/api/firebase/firebase.js'; // 설정된 firebase 불러오기
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { FirebaseProductRepository as ProductAPI } from '../../product/api/FirebaseProductRepository';
import { FirebaseTodoRepository as TodoAPI } from '../FirebaseTodoRepository.jsx';

const TodoContext = createContext();

export const TodoProvider = ({ orgId, children }) => {
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);

	// 1. 실시간 할 일 목록 구독
	useEffect(() => {
		if (!orgId) {
			setTodos([]);
			setLoading(false);
			return;
		}

		const q =
			collection(db, "organizations", orgId, 'todos');

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const todoList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setTodos(todoList);
			setLoading(false);
		});


		return () => unsubscribe();
	}, [orgId]);

	// 2. 할 일 삭제 함수
	const deleteTodo = async (todoId) => {
		TodoAPI.deleteTodo(orgId, todoId);
	};
	// Todo를 추가하는 로직 예시 (컴포넌트 내부)
	const addNewTodo = async (newTodoData) => {
		try {
			await TodoAPI.addTodo(orgId, newTodoData);
			console.log("할 일이 등록되었습니다.");
		} catch (e) {
			console.log(e.message);
			notice("등록 실패: " + e.message);
			throw (e);
		}
	};

	const updateTodo = async (todoId, updatedData) => {

		await TodoAPI.updateTodo(orgId, todoId, updatedData);

	};

	// 3. 할 일 실행 (재고 반영) 함수
	const executeTodo = async (todo) => {
		try {
			setLoading(true);

			// 개별 호출 대신 일괄(Batch) 처리 메서드 호출
			await ProductAPI.updateStocks(
				orgId,
				todo.items,
				todo.type,
				todo.id
			);

			console.log("일괄 재고 반영 완료");
		} catch (error) {
			console.error("할 일 실행 중 오류 발생:", error);
			notice("재고 반영 중 오류가 발생했습니다: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	const undoTodo = async (todo) => {
		try {
			// 이미 실행된 상태인지 한 번 더 체크 (방어적 코드)
			if (todo.status !== 'executed') {
				throw new Error("이미 대기 중이거나 실행되지 않은 항목입니다.");
			}

			await ProductAPI.undoStocks(
				orgId,
				todo.items,
				todo.type, // 원래의 타입(IN/OUT)을 넘겨줌
				todo.id
			);

			console.log("실행 취소 및 재고 원복(Batch) 완료");
		} catch (error) {
			console.error("실행 취소 중 오류 발생:", error);
			notice("취소 처리 중 오류가 발생했습니다: " + error.message);
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

export const useTodos = () => useContext(TodoContext);