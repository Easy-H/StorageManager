import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { FilterButton } from '../../../common/components/ui/react-native/custom';

import { useTodoSearch } from '../hooks/useTodoSearch';
import { Todo } from '../types';
import TodoItem from './TodoListItem';

type FilterType = "ALL" | "PENDING" | "EXECUTED";

interface TodoListProps {
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
    const [filterType, setFilterType] = useState<FilterType>("PENDING");
    const { searchResult } = useTodoSearch(todos, searchTerm);

    // --- 각 탭별 개수 실시간 계산 ---
    const counts = useMemo(() => ({
        ALL: searchResult.length,
        PENDING: searchResult.filter(t => t.status === 'pending').length,
        EXECUTED: searchResult.filter(t => t.status === 'executed').length,
    }), [searchResult]);

    // 상태에 따른 필터링 로직
    const filteredList = useMemo(() => searchResult.filter(todo => {
        if (filterType === "PENDING") return todo.status === 'pending';
        if (filterType === "EXECUTED") return todo.status === 'executed';
        return true; 
    }), [searchResult, filterType]);

    return (
        <>
            {/* 필터 탭 버튼 영역 - 개수 포함 */}
            <View style={localStyles.filterTabContainer}>
                <FilterButton
                    onPress={() => setFilterType("ALL")}
                    isActive={filterType === "ALL"}>
                    전체 ({counts.ALL})
                </FilterButton>

                <FilterButton
                    onPress={() => setFilterType("PENDING")}
                    isActive={filterType === "PENDING"}>
                        ⏳ 대기 ({counts.PENDING})
                </FilterButton>

                <FilterButton
                    onPress={() => setFilterType("EXECUTED")}
                    isActive={ filterType === "EXECUTED" }>
                    ✅ 완료 ({counts.EXECUTED})
                </FilterButton>
            </View>

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

const localStyles = StyleSheet.create({
    filterTabContainer: {
        flexDirection: 'row',
        gap: 8
    },
});

export default TodoList;