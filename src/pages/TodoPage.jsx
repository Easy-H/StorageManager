import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTodos } from '../features/todo/contexts/TodoContext';
import { styles, Colors } from '../styles';
import Header from '../common/components/Header';
import TodoModal from '../features/todo/components/TodoModal';

export default function TodoPage({ products, currentOrg, onBack, notice }) {
    const { todos, loading, deleteTodo, executeTodo, addNewTodo, updateTodo } = useTodos();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null); // 수정 시 사용

    const handleExecute = async (todo) => {
        console.log(todo);
        try {
            await executeTodo(todo);
            notice("재고에 성공적으로 반영되었습니다.");
        } catch (e) {
            notice("실행 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("이 할 일을 삭제하시겠습니까?")) {
            await deleteTodo(id);
            notice("삭제되었습니다.");
        }
    };

    const handleSaveTodo = async (data) => {
        try {
            console.log(data);
            if (selectedTodo) {
                // 수정
                await updateTodo(selectedTodo.id, data);
                notice("수정되었습니다.");
            } else {
                // 신규 등록 (아이템은 나중에 엑셀이나 상세페이지에서 추가하도록 설계)
                await addNewTodo(data);
                notice("등록되었습니다.");
            }
        } catch (e) {
            notice("오류가 발생했습니다.");
        }
    };

    const openEditModal = (todo) => {
        setSelectedTodo(todo);
        setModalVisible(true);
    };

    if (loading) return <View style={styles.centerContainer}><Text>로딩 중...</Text></View>;

    return (
        <View style={styles.appWrapper}>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
            <View style={styles.appContent}>
                {/* 상단 액션 바: 할 일이 없을 때나 있을 때나 명확한 가이드 제공 */}
                <View style={localStyles.actionBar}>
                    <Text style={localStyles.todoCount}>대기 중인 항목: {todos.length}개</Text>
                    <TouchableOpacity
                        style={localStyles.miniAddButton}
                        onPress={() => { setSelectedTodo(null); setModalVisible(true); }}
                    >
                        <Text>+ 새 할 일 만들기</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }} // FAB에 가려지지 않게 여백 추가
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => openEditModal(item)}>
                                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                                <Text>{item.type === 'IN' ? '입고' : '출고'}</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => handleExecute(item)} style={[styles.primaryButton, { marginRight: 8, paddingHorizontal: 15 }]}>
                                    <Text style={{ color: '#fff' }}>실행</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[localStyles.deleteIcon]}>
                                    <Text style={{ color: Colors.errorRed, fontSize: 12 }}>삭제</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>

            {modalVisible && (
                <TodoModal
                    products={products}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleSaveTodo}
                    initialData={selectedTodo}
                />
            )}
            {/* 우측 하단 플로팅 버튼: 엑셀 업로드 등에 활용하기 좋음 */}
            <TouchableOpacity
                style={localStyles.fab}
                onPress={() => notice("엑셀 업로드 기능 준비 중입니다.")}
            >
                <Text style={localStyles.fabText}>📂</Text>
            </TouchableOpacity>
        </View>
    );
}

const localStyles = StyleSheet.create({
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    todoCount: {
        fontSize: 14,
        color: '#666',
    },
    miniAddButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    deleteIcon: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.secondary || '#333',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabText: {
        fontSize: 24,
    }
});