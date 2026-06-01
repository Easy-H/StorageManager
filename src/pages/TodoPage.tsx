import { StyleSheet, Text, View } from 'react-native';

import SearchBar from '../common/components/SearchBar';
import { BlueButton, GreenButton } from '../common/components/ui/react-native/custom';

import { OrgMembership } from '../features/org/types';
import { Product } from '../features/product/types';
import TodoList from '../features/todo/components/TodoList';
import TodoModal from '../features/todo/components/TodoModal';
import { useTodoPage } from '../features/todo/hooks/useTodoPage';
import { Todo } from '../features/todo/types';
import { Colors, styles } from '../styles';

interface TodoPageProps {
    products: Product[];
    currentOrg: OrgMembership;
    onBack: () => void;
    notice: (msg: string) => void;
}

export default function TodoPage({ products, currentOrg, onBack, notice }: TodoPageProps) {
    const {
        todos,
        loading,
        modalVisible,
        setModalVisible,
        selectedTodo,
        searchTerm,
        setSearchTerm,
        fileInputRef,
        handleExecute,
        handleUndo,
        handleDelete,
        handleSaveTodo,
        handleFileChange,
        handleRegisterProduct,
        openEditModal,
        openAddModal
    } = useTodoPage(products, notice);

    if (loading) return <View style={styles.centerContainer}><Text>로딩 중...</Text></View>;

    return (
        <>

            <View style={styles.appContent}>
                {/*Hidden File Input for Web */}
                {/* @ts-ignore - Web input */}
                <input 
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                />

                <View style={styles.searchSection}>
                    <SearchBar
                        placeholder={"할 일 이름 검색..."}
                        value={searchTerm}
                        onChange={setSearchTerm} />
                    <GreenButton onPress={openAddModal}>
                        + 새 할 일
                    </GreenButton>

                    <BlueButton
                        onPress={() => (fileInputRef.current as any)?.click()}>
                            EXCEL
                    </BlueButton>
                </View>
                <TodoList todos={todos} searchTerm={searchTerm} openEditModal={openEditModal}
                    handleDelete={handleDelete} handleExecute={handleExecute} handleUndo={handleUndo} />

            </View>

            {modalVisible && (
                <TodoModal
                    products={products}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleSaveTodo}
                    onExecute={handleExecute} // 모달 내 실행 연동
                    onDelete={handleDelete}   // 모달 내 삭제 연동
                    onRegisterProduct={handleRegisterProduct} // 필수 Prop 추가
                    initialData={selectedTodo as any}
                    initialName={searchTerm}
                />
            )}

        </>
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