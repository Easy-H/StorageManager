import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as XLSX from 'xlsx';
import { useTodos } from '../features/todo/contexts/TodoContext';
import { styles, Colors } from '../styles';
import Header from '../common/components/Header';
import TodoModal from '../features/todo/components/TodoModal';

export default function TodoPage({ products, currentOrg, onBack, notice }) {
    const { todos, loading, deleteTodo, executeTodo, addNewTodo, updateTodo } = useTodos();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

    // Web용 파일 입력 참조
    const fileInputRef = useRef(null);

    // [실행] 재고 반영
    const handleExecute = async (todo) => {
        try {
            await executeTodo(todo);
            notice("재고에 성공적으로 반영되었습니다.");
        } catch (e) {
            notice("실행 중 오류가 발생했습니다.");
        }
    };

    // [삭제] 할 일 삭제
    const handleDelete = async (id) => {
        if (window.confirm("이 할 일을 삭제하시겠습니까?")) {
            await deleteTodo(id);
            notice("삭제되었습니다.");
        }
    };

    // [저장] 신규 등록 및 수정
    const handleSaveTodo = async (data) => {
        try {
            if (selectedTodo) {
                await updateTodo(selectedTodo.id, data);
                notice("수정되었습니다.");
            } else {
                await addNewTodo(data);
                notice("등록되었습니다.");
            }
        } catch (e) {
            notice("오류가 발생했습니다.");
        }
    };

    // [엑셀] 파일 선택 시 파싱 로직
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) return notice("엑셀 데이터가 비어있습니다.");

                // 상품명으로 ID 매칭 및 데이터 정제
                const items = data.map(row => {
                    const productName = row['상품명'] || row['Name'];
                    const matched = products.find(p => p.name === productName);
                    return {
                        productId: matched?.id || `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        name: productName,
                        quantity: Number(row['수량']) || 1,
                        isUnknown: !matched // DB에 없는 신규 품목임을 표시
                    };
                }).filter(item => item.productId); // 매칭 안된 상품은 제외

                if (items.length === 0) return notice("등록된 상품명과 일치하는 항목이 없습니다.");

                await addNewTodo({
                    title: `엑셀 업로드: ${file.name.split('.')[0]}`,
                    type: "IN",
                    items: items
                });
                notice(`${items.length}개의 품목이 등록되었습니다.`);
            } catch (err) {
                notice("엑셀 파싱 중 오류가 발생했습니다.");
            }
            // 같은 파일 다시 올릴 수 있도록 초기화
            e.target.value = '';
        };
        reader.readAsBinaryString(file);
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
                {/*Hidden File Input for Web */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                />

                <View style={localStyles.actionBar}>
                    <Text style={localStyles.todoCount}>대기 중인 항목: {todos.length}개</Text>
                    <TouchableOpacity
                        style={localStyles.miniAddButton}
                        onPress={() => { setSelectedTodo(null); setModalVisible(true); }}
                    >
                        <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>+ 새 할 일 만들기</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => openEditModal(item)}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                                <Text style={{ color: item.type === 'IN' ? Colors.primary : Colors.errorRed, marginTop: 4 }}>
                                    {item.type === 'IN' ? '🔵 입고 예정' : '🔴 출고 예정'}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => handleExecute(item)} style={[styles.primaryButton, { marginRight: 8, paddingHorizontal: 15 }]}>
                                    <Text style={{ color: '#fff' }}>실행</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={localStyles.deleteIcon}>
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
                    onExecute={handleExecute} // 모달 내 실행 연동
                    onDelete={handleDelete}   // 모달 내 삭제 연동
                    initialData={selectedTodo}
                />
            )}

            <TouchableOpacity
                style={localStyles.fab}
                onPress={() => fileInputRef.current?.click()}
            >
                <Text style={localStyles.fabText}>📂</Text>
                <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>EXCEL</Text>
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
    todoCount: { fontSize: 14, color: '#666' },
    miniAddButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    deleteIcon: { padding: 8 },
    fab: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: Colors.secondary || '#333',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        cursor: 'pointer', // Web 환경 대응
    },
    fabText: { fontSize: 24 }
});