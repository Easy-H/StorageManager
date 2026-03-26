import React, { useState } from 'react';
import { Modal, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { styles, Colors } from '../../../styles';
import * as Hangul from 'hangul-js';
import { useProductSearch } from '../../product/hooks/useProductSearch';

export default function ProductSearchModal({ visible, onClose, onSelect, products }) {
  const [searchKeyword, setKeyword] = useState('');
  const { searchResult } = useProductSearch(products, searchKeyword);

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
            data={searchResult}
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