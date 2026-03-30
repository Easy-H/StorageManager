import React, { useState } from 'react';
import { styles, Colors } from '../../../styles';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTodoSearch } from '../hooks/useTodoSearch';

const TodoList = ({ todos, searchTerm, openEditModal,
    handleExecute, handleDelete, handleUndo }) => {
    
    const [filterType, setFilterType] = useState("PENDING");
    const { searchResult } = useTodoSearch(todos, searchTerm);

    // --- [추가] 각 탭별 개수 실시간 계산 ---
    const counts = {
        ALL: searchResult.length,
        PENDING: searchResult.filter(t => t.status === 'pending').length,
        EXECUTED: searchResult.filter(t => t.status === 'executed').length,
    };

    // 2. 상태에 따른 필터링 로직
    const filteredList = searchResult.filter(todo => {
        if (filterType === "PENDING") return todo.status === 'pending';
        if (filterType === "EXECUTED") return todo.status === 'executed';
        return true; 
    });

    return (
        <>
            {/* 필터 탭 버튼 영역 - 개수 포함 */}
            <View style={localStyles.filterTabContainer}>
                <TouchableOpacity
                    onPress={() => setFilterType("ALL")}
                    style={[localStyles.filterTab, filterType === "ALL" && localStyles.activeTab]}>
                    <Text style={[localStyles.tabText, filterType === "ALL" && localStyles.activeTabText]}>
                        전체 ({counts.ALL})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setFilterType("PENDING")}
                    style={[localStyles.filterTab, filterType === "PENDING" && localStyles.activeTab]}>
                    <Text style={[localStyles.tabText, filterType === "PENDING" && localStyles.activeTabText]}>
                        ⏳ 대기 ({counts.PENDING})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setFilterType("EXECUTED")}
                    style={[localStyles.filterTab, filterType === "EXECUTED" && localStyles.activeTab]}>
                    <Text style={[localStyles.tabText, filterType === "EXECUTED" && localStyles.activeTabText]}>
                        ✅ 완료 ({counts.EXECUTED})
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>항목이 없습니다.</Text>
                )}
                renderItem={({ item }) => (
                    <View style={[styles.productItem, item.status === 'executed' && { opacity: 0.8 }]}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => item.status === 'pending' && openEditModal(item)}
                            disabled={item.status === 'executed'}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                                {item.status === 'executed' && (
                                    <Text style={localStyles.executedBadge}>완료</Text>
                                )}
                            </View>
                            <Text style={{ color: item.type === 'IN' ? Colors.primary : Colors.errorRed, marginTop: 4 }}>
                                {item.type === 'IN' ? '🔵 입고' : '🔴 출고'}
                                {item.status === 'executed' ? ' 처리됨' : ' 예정'}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {item.status === 'pending' ? (
                                <>
                                    <TouchableOpacity
                                        onPress={() => handleExecute(item)}
                                        style={[styles.primaryButton, { paddingHorizontal: 12 }]}>
                                        <Text style={{ color: '#fff', fontSize: 13 }}>실행</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={localStyles.deleteIcon}>
                                        <Text style={{ color: Colors.errorRed, fontSize: 12 }}>삭제</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        onPress={() => handleUndo(item)}
                                        style={localStyles.undoButton}>
                                        <Text style={{ color: '#666', fontSize: 12 }}>취소</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={localStyles.deleteIcon}>
                                        <Text style={{ color: Colors.errorRed, fontSize: 12 }}>삭제</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                )}
            />
        </>
    );
}

const localStyles = StyleSheet.create({
    filterTabContainer: {
        flexDirection: 'row',
        gap: 8
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeTab: {
        backgroundColor: '#fff',
        borderColor: Colors.primary,
    },
    tabText: { fontSize: 11, color: '#666' },
    activeTabText: { color: Colors.primary, fontWeight: 'bold' },
    deleteIcon: { padding: 8 },
    executedBadge: {
        fontSize: 10,
        backgroundColor: '#eee',
        color: '#888',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 3,
        overflow: 'hidden'
    },
    undoButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd'
    },
});

export default TodoList;