import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { styles, Colors } from '../../../styles';
import ProductSearchModal from './ProductSearchModal';

export default function TodoModal({ visible, onClose, onSave, onExecute, onDelete, initialData, products }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('IN');
  const [items, setItems] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (visible && initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'IN');
      setItems(initialData.items || []);
    } else if (visible) {
      setTitle(''); setType('IN'); setItems([]);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    const validItems = items.filter(item => item.productId && item.quantity > 0);
    onSave({ title, type, items: validItems });
    onClose();
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.h2}>{initialData ? "할 일 관리" : "새 할 일 등록"}</Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            placeholder="제목"
            style={styles.inputBasic} value={title}
            onChangeText={setTitle} />
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text style={styles.h3}>거래 유형</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setType('IN')}
              style={[type === 'IN' && { backgroundColor: Colors.primary, borderColor: Colors.primary, alignContent: 'center' }]}>
              <Text style={{ color: type === 'IN' ? '#fff' : '#666' }}>입고 (+)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType('OUT')}
              style={[type === 'OUT' && { backgroundColor: Colors.errorRed, borderColor: Colors.errorRed, alignContent: 'center' }]}>
              <Text style={{ color: type === 'OUT' ? '#fff' : '#666' }}>출고 (-)</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{gap: 10}}>
          <View style={localStyles.itemHeader}>
            <Text style={styles.h3}>품목 리스트</Text>
            <TouchableOpacity onPress={() => setItems([...items, { productId: '', name: '', quantity: 1 }])}>
              <Text style={{ color: Colors.primary }}>+ 품목 추가</Text>
            </TouchableOpacity>
          </View>
        <ScrollView style={{ gap: 10, maxHeight: '100%' }}>

          {items.map((item, index) => (
            <View key={index} style={[localStyles.itemRow, { justifyContent: 'space-between' }]}>
              <TouchableOpacity style={[localStyles.productPick, { flex: 1 }]} onPress={() => { setActiveIndex(index); setSearchModalVisible(true); }}>
                <Text>{item.name || "제품 선택..."}</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.inputBasic, { width: 50 }]}
                keyboardType="numeric"
                value={String(item.quantity)}
                onChangeText={(v) => {
                  const next = [...items];
                  next[index].quantity = Number(v) || 0;
                  setItems(next);
                }}
              />
              <TouchableOpacity onPress={() => setItems(items.filter((_, i) => i !== index))}>
                <Text style={{ color: Colors.errorRed }}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        </View>

        {/* 하단 버튼 영역: 수정 모드일 때 실행/삭제 추가 */}
        <View style={{ gap: 20 }}>
          {initialData && (
            <TouchableOpacity
              style={[styles.blueButton]}
              onPress={() => { onExecute(initialData); onClose(); }}>
              <Text style={styles.buttonText}>재고 반영(실행)</Text>
            </TouchableOpacity>
          )}
          <View style={[styles.buttonRow]}>

            <TouchableOpacity style={[styles.greenButton, {flex: 2}]} onPress={handleSave}>
              <Text style={styles.buttonText}>저장하기</Text>
            </TouchableOpacity>
            {initialData && (
              <TouchableOpacity
                onPress={() => { onDelete(initialData.id); onClose(); }}
                style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={[styles.linkButton, { color: '#ff4d4f' }]}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
            <Text style={styles.closeModalBtnText}>닫기</Text>
          </TouchableOpacity>
        </View>

        {searchModalVisible && (
          <ProductSearchModal
            visible={searchModalVisible}
            products={products}
            selectedIds={items.map(i => i.productId)} // 이미 선택된 ID 전달
            onSelect={(p) => {
              const next = [...items];
              next[activeIndex] = { productId: p.id, name: p.name, quantity: 1 };
              setItems(next);
            }}
            onClose={() => setSearchModalVisible(false)}
          />
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  typeBtn: { flex: 1, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  addButton: { padding: 5 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end'}
});