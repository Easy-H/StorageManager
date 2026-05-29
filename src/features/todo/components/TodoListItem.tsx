import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styles, Colors } from '../../../styles';
import { Todo } from '../types';
import { ListItem } from '../../../common/components/ui/react-native/custom';

interface TodoItemProps {
    item: Todo;
    openEditModal: (item: Todo) => void;
    handleExecute: (item: Todo) => void;
    handleDelete: (id: string) => void;
    handleUndo: (item: Todo) => void;
}

const TodoItem = ({ item, openEditModal, handleExecute, handleDelete, handleUndo }: TodoItemProps) => {
    return (
        <ListItem style={[styles.productItem, item.status === 'executed' && { opacity: 0.8 }]}>
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
                            style={localStyles.executeButton}>
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
        </ListItem>
    );
};

const localStyles = StyleSheet.create({
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
    executeButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: Colors.primary,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.primary,
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

export default TodoItem;