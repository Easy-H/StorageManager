import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../../common/api/firebase/firebase.js'; // 설정된 firebase 불러오기
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { FirebaseProductRepository as ProductAPI } from '../../product/api/FirebaseProductRepository';
import { FirebaseTodoRepository } from '../FirebaseTodoRepository.jsx';
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
		FirebaseTodoRepository.deleteTodo(orgId, todoId);
	};
	// Todo를 추가하는 로직 예시 (컴포넌트 내부)
	const addNewTodo = async (newTodoData) => {

		try {
			await FirebaseTodoRepository.addTodo(orgId, newTodoData);
			console.log("할 일이 등록되었습니다.");
		} catch (e) {
			alert("등록 실패: " + e.message);
		}
	};

	const updateTodo = async (todoId, updatedData) => {
		
		await  FirebaseTodoRepository.updateTodo(orgId, todoId, updatedData);
			
	};

	// 3. 할 일 실행 (재고 반영) 함수
	const executeTodo = async (todo) => {
		try {
			console.log(todo);
			// 1. 할 일(Todo)에 담긴 모든 아이템을 순회하며 재고 업데이트 API 호출
			const updatePromises = todo.items.map(item => {
				// API 규격에 맞게 매개변수 구성
				console.log(item);
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

			// 3. 재고 반영이 성공하면 할 일(Todo) 삭제
			await deleteTodo(todo.id);

		} catch (error) {
			console.error("할 일 실행 중 오류 발생:", error);
			throw error; // 상위 컴포넌트(TodoPage)에서 에러 메시지를 띄울 수 있게 던짐
		}
	};

	return (
		<TodoContext.Provider value={{ todos, loading, deleteTodo, executeTodo, addNewTodo, updateTodo }}>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodos = () => useContext(TodoContext);