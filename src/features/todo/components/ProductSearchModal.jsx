import React, { useState } from 'react';
import { Modal, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { styles, Colors } from '../../../styles';
import * as Hangul from 'hangul-js';
import { useProductSearch } from '../../product/hooks/useProductSearch';

export default function ProductSearchModal({ onClose, onSelect, products, productSelected }) {
  const [searchKeyword, setKeyword] = useState('');
  const { searchResult } = useProductSearch(products, searchKeyword);

  // --- [추가] 중복 제외 필터링 로직 ---
  // productSelected가 객체 배열일 경우를 가정하여 productId들을 추출합니다.
  const selectedIds = (productSelected || []).map(p => p.productId).filter(id => id !== null);

  // 검색 결과 중 이미 선택된 ID를 가진 제품은 제외합니다.
  const filteredResult = searchResult.filter(item => !selectedIds.includes(item.id));

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.h2}>제품 선택 (중복 제외)</Text>
        <TextInput
          style={styles.inputBasic}
          placeholder="제품명 검색..."
          value={searchKeyword}
          onChangeText={setKeyword}
          autoFocus={true} // 모달 열리자마자 바로 입력 가능하게 추가
        />
        <View style={{ backgroundColor: '#fff', borderRadius: 10, maxHeight: '100%' }}>
          <FlatList
            // 검색 결과 대신 필터링된 결과를 사용합니다.
            data={filteredResult}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 300, minHeight: 300 }}
            contentContainerStyle={{ gap: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { 
                  onSelect(item); 
                  setKeyword(''); 
                  onClose(); 
                }}
                style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>현재 재고: {item.currentStock}</Text>
              </TouchableOpacity>
            )}

            ListEmptyComponent={() => (
              <View style={{ padding: 20, alignItems: 'center' }}>
                {searchKeyword.trim().length > 0 ? (
                  <>
                    <Text style={{ color: '#888', marginBottom: 10 }}>검색 결과가 없거나 이미 추가된 제품입니다.</Text>
                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={() => {
                        // 임시 추가 시에는 중복 체크 로직이 없으므로 바로 진행
                        onSelect({ id: null, name: searchKeyword });  
                        setKeyword(''); 
                        onClose();
                      }}
                    >
                      <Text style={{ color: '#fff' }}>'{searchKeyword}' (으)로 임시 추가</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={{ color: '#999' }}>검색어를 입력해주세요.</Text>
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