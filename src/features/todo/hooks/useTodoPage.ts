import { useState } from 'react';
import { Product } from '../../product/types';
import { useTodos } from '../contexts/TodoContext';
import { useTodoActions } from './useTodoActions';
import { useTodoExcel } from './useTodoExcel';
import { useTodoModal } from './useTodoModal';
import { Todo } from '../types';

export const useTodoPage = (products: Product[], notice: (msg: string) => void) => {
    const { todos, loading } = useTodos() as any;
    const [searchTerm, setSearchTerm] = useState("");

    const {
        modalVisible,
        setModalVisible,
        selectedTodo,
        openEditModal,
        openAddModal
    } = useTodoModal();

    const {
        handleExecute,
        handleUndo,
        handleDelete,
        handleSaveTodo,
        addNewTodo
    } = useTodoActions(notice);

    const { fileInputRef, handleFileChange } = useTodoExcel(products, addNewTodo, notice);

    // 제품 등록 브릿지
    const handleRegisterProduct = async (name: string): Promise<string | null> => {
        notice(`'${name}' 제품 등록 기능이 구현되어야 합니다.`);
        return null;
    };

    // 저장 후 모달 닫기 처리를 위한 래퍼
    const onSaveTodo = async (data: any) => {
        const success = await handleSaveTodo(data, selectedTodo?.id);
        if (success) setModalVisible(false);
    };

    return {
        todos, loading, modalVisible, setModalVisible,
        selectedTodo, searchTerm, setSearchTerm, fileInputRef,
        handleExecute, handleUndo, handleDelete, handleSaveTodo: onSaveTodo,
        handleFileChange, handleRegisterProduct, openEditModal, openAddModal
    };
};