import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { styles, Colors } from '../../../styles';
import ProductSearchModal from './ProductSearchModal';
import { BlueButton, CloseButton, GreenButton, InputText, Modal } from '../../../common/components/ui/react-native/custom'
import { Button, H2, H3 } from '../../../common/components/ui/react-native/common';

export default function TodoModal({ visible, onClose, onSave, onExecute, onDelete, onRegisterProduct, initialData, initialName, products }) {
  const [title, setTitle] = useState(initialName);
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
        setTitle(initialName);
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
    <Modal visible={visible}>
      <H2>{initialData ? "할 일 관리" : "새 할 일 등록"}</H2>

      {/* 제목 입력 */}
      <View style={{ marginBottom: 15 }}>
        <InputText
          placeholder="할 일 제목 (예: 3월 20일 입고분)"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* 유형 선택 */}
      <View style={localStyles.sectionRow}>
        <H3>거래 유형</H3>
        <View style={localStyles.typeButtonGroup}>
          <Button
            onPress={() => setType('IN')}
            style={[localStyles.typeBtn, type === 'IN' && { backgroundColor: Colors.primary, borderColor: Colors.primary, color: type === 'IN' ? '#fff' : '#666' }]}>
            입고 (+)
          </Button>
          <Button
            onPress={() => setType('OUT')}
            style={[localStyles.typeBtn, type === 'OUT' && { backgroundColor: Colors.errorRed, borderColor: Colors.errorRed, color: type === 'OUT' ? '#fff' : '#666' }]}>
            출고 (-)
          </Button>
        </View>
      </View>

      {/* 품목 리스트 영역 */}
      <View style={{ flex: 1 }}>
        <View style={localStyles.itemHeader}>
          <H3>품목 리스트 ({items.length})</H3>
          <Button onPress={() => setItems([...items, { productId: '', name: '', quantity: 1 }])}
            style={{ color: Colors.primary, fontWeight: 'bold' }}>
            + 추가
          </Button>
        </View>
        <ScrollView
          ref={scrollViewRef} // 2. ref 연결
          style={{ maxHeight: 150, minHeight: 150, }}
          // 3. 컨텐츠 사이즈가 변할 때(아이템 추가 시) 자동으로 아래로 이동
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {items.map((item, index) => {
            const isUnknown = item.productId ? false : true; // ID가 없으면 미등록(빨간색 표시)

            return (
              <View key={index} style={[localStyles.itemRow, isUnknown && localStyles.unknownRow]}>
                {/* 제품 선택 또는 이름 표시 */}
                <Button
                  style={[localStyles.productPick, { flex: 1, color: isUnknown ? Colors.errorRed : '#333', fontWeight: isUnknown ? 'bold' : 'normal' }]}
                  onPress={() => { setActiveIndex(index); setSearchModalVisible(true); }}
                >
                  {item.name || "제품 선택..."} {isUnknown && "(미등록)"}
                </Button>

                {/* 미등록 시 등록 버튼 노출 */}

                {
                  !!(item && item.name && isUnknown) && (
                    <Button
                      onPress={() => handleRegisterNew(index)}
                      style={[localStyles.miniRegisterBtn, { fontSize: 20, color: '#fff', padding: 5 }]}>
                      등록
                    </Button>
                  )
                }

                {/* 수량 입력 */}
                <InputText
                  style={{ width: 80, textAlign: 'center' }}
                  keyboardType="numeric"
                  value={String(item.quantity)}
                  onChangeText={(v) => {
                    const next = [...items];
                    next[index].quantity = Number(v) || 0;
                    setItems(next);
                  }}
                />

                {/* 행 삭제 */}
                <Button onPress={() => setItems(items.filter((_, i) => i !== index))} style={{ padding: 5, color: Colors.errorRed }}>
                  ❌
                </Button>
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
          <BlueButton style={{ width: '100%' }}
            onPress={() => { onExecute(initialData); onClose(); }}>
            재고에 최종 반영(실행)
          </BlueButton>
        )}

        <View style={styles.buttonRow}>
          <GreenButton style={{ flex: 2 }} onPress={handleSave}>
            {initialData ? "변경사항 저장" : "할 일 등록하기"}
          </GreenButton>

          {initialData && (
            <Button
              onPress={() => { onDelete(initialData.id); onClose(); }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', color: Colors.errorRed, fontWeight: 'bold' }}>
              삭제
            </Button>
          )}
        </View>

        <CloseButton onPress={onClose}>
          닫기
        </CloseButton>
      </View>

      {/* 제품 검색 모달 연동 */}
      {searchModalVisible && (
        <ProductSearchModal
          visible={searchModalVisible}
          products={products}
          productSelected={items}
          onSelect={(p) => {
            const next = [...items];
            next[activeIndex] = { productId: p.id, name: p.name, quantity: 1 };
            setItems(next);
          }}
          onClose={() => setSearchModalVisible(false)}
        />
      )}
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  typeButtonGroup: { flexDirection: 'row', gap: 5 },
  typeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5, justifyContent: 'stretch' },
  unknownRow: { backgroundColor: '#fff1f0', borderRadius: 4 },
  productPick: { padding: 8, backgroundColor: '#f9f9f9', borderRadius: 4, borderWidth: 1, borderColor: '#eee' },
  miniRegisterBtn: { backgroundColor: Colors.primary, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 }
});