import React, { useState } from 'react';
import { Modal, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { styles, Colors } from '../../../styles';
import * as Hangul from 'hangul-js';

export default function ProductSearchModal({ visible, onClose, onSelect, products }) {
  const [searchKeyword, setKeyword] = useState('');

  // 검색어에 따른 제품 필터링
  
  let filteredProducts = products.filter(p => {
    const name = (p.name || "").toLowerCase();
    const barcode = (p.barcode || "").toLowerCase();

    // 1. 바코드 숫자에 키워드가 포함되는지 확인
    if (barcode.includes(searchKeyword)) return true;

    // 2. 일반 검색 (부분 일치: '크리' -> '클린')
    if (Hangul.search(name, searchKeyword) !== -1) return true;

    // 3. 초성 검색 (초성만 입력했을 때: 'ㅋㄹ' -> '클린')
    // 검색어 자체가 초성으로만 이루어져 있는지 확인
    const isChoseongQuery = searchKeyword.split('').every(char => Hangul.isConsonant(char) && !Hangul.isVowel(char));

    if (isChoseongQuery) {
      // 제품명에서 초성만 추출 (예: '클린' -> 'ㅋㄹ')
      const choseongName = Hangul.disassemble(name, true).map(group => group[0]).join('');
      return choseongName.includes(searchKeyword);
    }

    return false;
  });

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.h2}>제품 선택 (중복 제외)</Text>
        <TextInput
          style={styles.inputBasic}
          placeholder="제품명 검색..."
          value={searchKeyword}
          onChangeText={setKeyword}
        />
        <View style={{ backgroundColor: '#fff', borderRadius: 10, maxHeight: '100%' }}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 300, minHeight: 300, }}
            contentContainerStyle={{gap : 20}}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { onSelect(item); setKeyword(''); onClose(); }}
              >
                <Text>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>현재 재고: {item.currentStock}</Text>
              </TouchableOpacity>
            )}

            ListEmptyComponent={() => (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#888', marginBottom: 10 }}>검색 결과가 없습니다.</Text>
                {searchKeyword.trim().length > 0 && (
                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => {onSelect({ id: null, name: searchKeyword, isUnknown: true });  setKeyword(''); onClose();}}
                  >
                    <Text style={{ color: '#fff' }}>'{searchKeyword}' (으)로 임시 추가</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
          <Text style={styles.closeModalBtnText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}