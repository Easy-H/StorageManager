import { useState } from 'react';
import { Todo } from '../types';

export const useTodoModal = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

    const openEditModal = (todo: Todo) => {
        setSelectedTodo(todo);
        setModalVisible(true);
    };

    const openAddModal = () => {
        setSelectedTodo(null);
        setModalVisible(true);
    };

    return {
        modalVisible,
        setModalVisible,
        selectedTodo,
        openEditModal,
        openAddModal
    };
};