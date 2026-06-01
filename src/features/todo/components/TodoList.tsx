import { useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';

import FilterHeader, { FilterTab } from '../../../common/components/ui/react-native/custom/FilterHeader';
import { useTodoSearch } from '../hooks/useTodoSearch';
import { Todo, TodoStatus } from '../types';
import TodoItem from './TodoListItem';

type TodoListProps = {
    todos: Todo[];
    searchTerm: string;
    openEditModal: (item: Todo) => void;
    handleExecute: (item: Todo) => void;
    handleDelete: (id: string) => void;
    handleUndo: (item: Todo) => void;
}

const TodoList = ({ 
    todos, 
    searchTerm, 
    openEditModal,
    handleExecute, 
    handleDelete, 
    handleUndo 
}: TodoListProps) => {
    const [filterType, setFilterType] = useState<string>("PENDING");
    const { searchResult } = useTodoSearch(todos, searchTerm);

    // --- 각 탭별 개수 실시간 계산 ---
    const counts = useMemo(() => ({
        ALL: searchResult.length,
        PENDING: searchResult.filter(t => t.status === TodoStatus.PENDING).length,
        EXECUTED: searchResult.filter(t => t.status === TodoStatus.EXECUTED).length,
    }), [searchResult]);

    // 상태에 따른 필터링 로직
    const filteredList = useMemo(() => searchResult.filter(todo => {
        if (filterType === "PENDING") return todo.status === TodoStatus.PENDING;
        if (filterType === "EXECUTED") return todo.status === TodoStatus.EXECUTED;
        return true; 
    }), [searchResult, filterType]);

    const tabs: FilterTab[] = [
        { label: "전체", value: "ALL", count: counts.ALL },
        { label: "⏳ 대기", value: "PENDING", count: counts.PENDING },
        { label: "✅ 완료", value: "EXECUTED", count: counts.EXECUTED },
    ];

    return (
        <>            
            <FilterHeader
                tabs={tabs}
                activeTab={filterType}
                onTabChange={setFilterType}
            />

            <FlatList
                data={filteredList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>항목이 없습니다.</Text>
                )}
                renderItem={({ item }) => (
                    <TodoItem
                        item={item}
                        openEditModal={openEditModal}
                        handleExecute={handleExecute}
                        handleDelete={handleDelete}
                        handleUndo={handleUndo}
                    />
                )}
            />
        </>
    );
};
export default TodoList;