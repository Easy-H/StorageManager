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
			alert("등록 실패: " + e.message);
			throw (e);
		}
	};

	const updateTodo = async (todoId, updatedData) => {

		await TodoAPI.updateTodo(orgId, todoId, updatedData);

	};

	// 3. 할 일 실행 (재고 반영) 함수
	const executeTodo = async (todo) => {
		try {
			console.log(todo);
			// 1. 할 일(Todo)에 담긴 모든 아이템을 순회하며 재고 업데이트 API 호출
			const updatePromises = todo.items.map(item => {
				// API 규격에 맞게 매개변수 구성
				// item 객체는 최소한 { id, currentStock, name } 정보를 가지고 있어야 합니다.
				return ProductAPI.updateStock(
					orgId,      // 조직 ID
					item.productId,
					item.quantity,   // 변동 수량
					false,           // 직접 입력 아님 (상대적 가감)
					todo.type        // 'IN' 또는 'OUT'
				);
			});

			// 2. 모든 재고 업데이트가 완료될 때까지 대기
			await Promise.all(updatePromises);

			await updateTodo(todo.id, {
				status: 'executed',
				executedAt: new Date() // 또는 서버 타임스탬프
			});

		} catch (error) {
			console.error("할 일 실행 중 오류 발생:", error);
			throw error; // 상위 컴포넌트(TodoPage)에서 에러 메시지를 띄울 수 있게 던짐
		}
	};

	const undoTodo = async (todo) => {
		try {
			// 1. 재고 반대 연산 수행
			const undoPromises = todo.items.map(item => {
				// 현재 타입이 'IN'(입고)이면 'OUT'(출고)으로, 'OUT'이면 'IN'으로 반전시켜 호출
				const reverseType = todo.type === 'IN' ? 'OUT' : 'IN';

				return ProductAPI.updateStock(
					orgId,
					item.productId,
					item.quantity,
					false,
					reverseType
				);
			});

			await Promise.all(undoPromises);

			// 2. 상태를 다시 'pending'으로 변경하고 실행일 삭제
			await updateTodo(todo.id, {
				status: 'pending',
				executedAt: null // 실행 취소 시 시간 기록 삭제
			});

			console.log("실행 취소 및 재고 원복 완료");
		} catch (error) {
			console.error("실행 취소 중 오류 발생:", error);
			throw error;
		}
	};

	return (
		<TodoContext.Provider value={{ todos, loading,
			deleteTodo, executeTodo, addNewTodo, updateTodo, undoTodo }}>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodos = () => useContext(TodoContext);