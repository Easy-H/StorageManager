import { useTodos } from '../contexts/TodoContext';
import { Todo } from '../types';

export const useTodoActions = (notice: (msg: string) => void) => {
    const { deleteTodo, executeTodo, addNewTodo, updateTodo, undoTodo } = useTodos() as any;

    const handleExecute = async (todo: Todo) => {
        try {
            await executeTodo(todo);
            notice("재고에 성공적으로 반영되었습니다.");
        } catch (e) {
            notice("실행 중 오류가 발생했습니다.");
        }
    };
    
    const handleUndo = async (todo: Todo) => {
        try {
            await undoTodo(todo);
            notice("재고에 성공적으로 반영되었습니다.");
        } catch (e) {
            notice("실행 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (id: string) => {
        // @ts-ignore - Web confirm
        if (window.confirm("이 할 일을 삭제하시겠습니까?")) { 
            await deleteTodo(id);
            notice("삭제되었습니다.");
        }
    };

    const handleSaveTodo = async (data: any, id?: string) => {
        try {
            if (id) {
                await updateTodo(id, data);
                notice("수정되었습니다.");
            } else {
                await addNewTodo(data);
                notice("등록되었습니다.");
            }
            return true;
        } catch (e) {
            notice("오류가 발생했습니다.");
            return false;
        }
    };

    return {
        handleExecute, handleUndo, handleDelete, handleSaveTodo,
        addNewTodo // 엑셀 업로드 등에서 직접 접근이 필요한 경우를 위해 반환
    };
};