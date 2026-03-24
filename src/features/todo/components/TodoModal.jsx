import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { styles, Colors } from '../../../styles';
import ProductSearchModal from './ProductSearchModal';

export default function TodoModal({ visible, onClose, onSave, onExecute, onDelete, onRegisterProduct, initialData, products }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('IN');
  const [items, setItems] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const scrollViewRef = useRef(null); // 1. ref 생성

  // 모달이 열릴 때 초기 데이터 바인딩
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title || '');
        setType(initialData.type || 'IN');
        setItems(initialData.items || []);
      } else {
        setTitle('');
        setType('IN');
        setItems([]);
      }
    }
  }, [initialData, visible]);

  // [기능] 신규 상품으로 정식 등록 (미등록 아이템 해결)
  const handleRegisterNew = async (index) => {
    const item = items[index];
    if (!item.name) return alert("상품명이 필요합니다.");

    if (window.confirm(`'${item.name}'을(를) 시스템에 새 상품으로 등록하시겠습니까?`)) {
      try {
        // 부모로부터 전달받은 상품 등록 함수 실행 (ID 반환 가정)
        const newId = await onRegisterProduct(item.name);
        if (newId) {
          const next = [...items];
          next[index].productId = newId;
          setItems(next);
          alert("성공적으로 등록 및 연결되었습니다.");
        }
      } catch (e) {
        alert("등록 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSave = () => {
    // 유효한 아이템만 필터링 (최소 수량 1 이상)
    const validItems = items.filter(item => item.productId && item.quantity > 0);

    if (validItems.length === 0) {
      return alert("연결된 유효 품목이 없습니다. 모든 품목을 연결하거나 등록해주세요.");
    }

    onSave({ title, type, items: validItems });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.h2}>{initialData ? "할 일 관리" : "새 할 일 등록"}</Text>

          {/* 제목 입력 */}
          <View style={{ marginBottom: 15 }}>
            <TextInput
              placeholder="할 일 제목 (예: 3월 20일 입고분)"
              style={styles.inputBasic}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* 유형 선택 */}
          <View style={localStyles.sectionRow}>
            <Text style={styles.h3}>거래 유형</Text>
            <View style={localStyles.typeButtonGroup}>
              <TouchableOpacity
                onPress={() => setType('IN')}
                style={[localStyles.typeBtn, type === 'IN' && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}>
                <Text style={{ color: type === 'IN' ? '#fff' : '#666' }}>입고 (+)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('OUT')}
                style={[localStyles.typeBtn, type === 'OUT' && { backgroundColor: Colors.errorRed, borderColor: Colors.errorRed }]}>
                <Text style={{ color: type === 'OUT' ? '#fff' : '#666' }}>출고 (-)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 품목 리스트 영역 */}
          <View style={{ flex: 1 }}>
            <View style={localStyles.itemHeader}>
              <Text style={styles.h3}>품목 리스트 ({items.length})</Text>
              <TouchableOpacity onPress={() => setItems([...items, { productId: '', name: '', quantity: 1 }])}>
                <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>+ 추가</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              ref={scrollViewRef} // 2. ref 연결
              style={{ maxHeight: 300, minHeight: 300, }}
              // 3. 컨텐츠 사이즈가 변할 때(아이템 추가 시) 자동으로 아래로 이동
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {items.map((item, index) => {
                const isUnknown = item.isUnknown; // ID가 없으면 미등록(빨간색 표시)

                return (
                  <View key={index} style={[localStyles.itemRow, isUnknown && localStyles.unknownRow]}>
                    {/* 제품 선택 또는 이름 표시 */}
                    <TouchableOpacity
                      style={[localStyles.productPick, { flex: 1 }]}
                      onPress={() => { setActiveIndex(index); setSearchModalVisible(true); }}
                    >
                      <Text style={{ color: isUnknown ? Colors.errorRed : '#333', fontWeight: isUnknown ? 'bold' : 'normal' }}>
                        {item.name || "제품 선택..."} {isUnknown && "(미등록)"}
                      </Text>
                    </TouchableOpacity>

                    {/* 미등록 시 등록 버튼 노출 */}

                    {
                      isUnknown && item.name && (
                        <TouchableOpacity
                          onPress={() => handleRegisterNew(index)}
                          style={localStyles.miniRegisterBtn}>
                          <Text style={{ fontSize: 14, color: '#fff', padding: 5 }}>등록</Text>
                        </TouchableOpacity>
                      )}

                    {/* 수량 입력 */}
                    <TextInput
                      style={[styles.inputBasic, { width: 80, textAlign: 'center' }]}
                      keyboardType="numeric"
                      value={String(item.quantity)}
                      onChangeText={(v) => {
                        const next = [...items];
                        next[index].quantity = Number(v) || 0;
                        setItems(next);
                      }}
                    />

                    {/* 행 삭제 */}
                    <TouchableOpacity onPress={() => setItems(items.filter((_, i) => i !== index))} style={{ padding: 5 }}>
                      <Text style={{ color: Colors.errorRed }}>❌</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {items.length === 0 && (
                <Text style={{ textAlign: 'center', color: '#ccc', marginVertical: 20 }}>등록된 품목이 없습니다.</Text>
              )}
            </ScrollView>
          </View>

          {/* 하단 액션 버튼 */}
          <View style={{ gap: 20 }}>
            {initialData && (
              <TouchableOpacity
                style={[styles.blueButton, { width: '100%' }]}
                onPress={() => { onExecute(initialData); onClose(); }}>
                <Text style={styles.buttonText}>재고에 최종 반영(실행)</Text>
              </TouchableOpacity>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.greenButton, { flex: 2 }]} onPress={handleSave}>
                <Text style={styles.buttonText}>{initialData ? "변경사항 저장" : "할 일 등록하기"}</Text>
              </TouchableOpacity>

              {initialData && (
                <TouchableOpacity
                  onPress={() => { onDelete(initialData.id); onClose(); }}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: Colors.errorRed, fontWeight: 'bold' }}>삭제</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
              <Text style={styles.closeModalBtnText}>닫기</Text>
            </TouchableOpacity>
          </View>

          {/* 제품 검색 모달 연동 */}
          {searchModalVisible && (
            <ProductSearchModal
              visible={searchModalVisible}
              products={products}
              selectedIds={items.map(i => i.productId).filter(id => id)}
              onSelect={(p) => {
                const next = [...items];
                next[activeIndex] = { productId: p.id, name: p.name, quantity: 1, isUnknown: p.isUnknown };
                setItems(next);
              }}
              onClose={() => setSearchModalVisible(false)}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  typeButtonGroup: { flexDirection: 'row', gap: 5 },
  typeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  unknownRow: { backgroundColor: '#fff1f0', borderRadius: 4, paddingHorizontal: 5 },
  productPick: { padding: 8, backgroundColor: '#f9f9f9', borderRadius: 4, borderWidth: 1, borderColor: '#eee' },
  miniRegisterBtn: { backgroundColor: Colors.primary, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 }
});