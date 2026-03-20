import React, { useState } from 'react';
import { Modal, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { styles, Colors } from '../../../styles';

export default function ProductSearchModal({ visible, onClose, onSelect, products }) {
  const [keyword, setKeyword] = useState('');

  // 검색어에 따른 제품 필터링
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase()) ||
    p.category?.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.h2}>제품 선택 (중복 제외)</Text>
        <TextInput
          style={styles.inputBasic}
          placeholder="제품명 검색..."
          value={keyword}
          onChangeText={setKeyword}
        />
        <View style={{ backgroundColor: '#fff', borderRadius: 10, maxHeight: '100%' }}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{gap : 20}}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { onSelect(item); setKeyword(''); onClose(); }}
              >
                <Text>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>현재 재고: {item.currentStock}</Text>
              </TouchableOpacity>
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