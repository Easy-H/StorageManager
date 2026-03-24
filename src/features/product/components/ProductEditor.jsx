import React from 'react';
import {
  View, ScrollView, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform, Dimensions
} from 'react-native';
import { styles } from '../../../styles.js'

const ProductEditor = ({ item, form, setForm, onSave, onDelete, inputQty }) => (
  <View style={styles.formStack}>
    <Text style={styles.h3}>{item.isNew ? "신규 품목 등록" : "정보 수정"}</Text>
    <TextInput
      value={form.name}
      onChange={e => setForm({ ...form, name: e.target.value })}
      placeholder="품목 이름"
      style={styles.inputBasic}
    />
    <TextInput
      value={form.barcode}
      onChange={e => setForm({ ...form, barcode: e.target.value })}
      placeholder="바코드(선택)"
      style={styles.inputBasic}
    />
    {item.isNew && (
      <>
      <Text style={{ fontSize: '12', textAlign: 'left', marginTop: '10px' }}>
      최초 입고 수량 (선택)
      </Text>
        <TextInput
          type="number"
          value={form.initialStock | 0}
          onChange={e => setForm({ ...form, initialStock: Number(e.target.value) })}
          placeholder="0"
          style={[styles.inputBasic]}
        />
      </>
    )}
    <Text style={{ fontSize: '12', textAlign: 'left', marginTop: '10px' }}>안전 재고 기준 (개)</Text>
    <TextInput
      type="number"
      value={form.safetyStock}
      onChange={e => setForm({ ...form, safetyStock: Number(e.target.value) })}
      style={styles.inputBasic}
    />

    <TextInput
      multiline
      numberOfLines={4}
      value={form.memo}
      onChange={e => setForm({ ...form, memo: e.target.value })}
      placeholder="기타 메모 (보관 방법, 주의사항 등 자유롭게 입력)"
      style={[styles.inputBasic, localStyles.memoInput]}
    />


    <View style={[styles.buttonRow, { marginTop: '10px', gap: '8px' }]}>
      <TouchableOpacity onPress={() => onSave(item.id, form, inputQty)}
        style={[styles.greenButton, { flex: 2 }]}>
        <Text style={styles.buttonText}>저장하기</Text>
      </TouchableOpacity>
      {!item.isNew && (
        <TouchableOpacity onPress={() => onDelete(item)}
          style={{ justifyContent: 'center', flex: 1 }}>
          <Text style={[styles.linkButton, { color: '#ff4d4f' }]}>삭제</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const localStyles = StyleSheet.create({
  memoInput: {
    height: 100, // 여러 줄 입력을 위한 충분한 높이
    textAlignVertical: 'top', // 텍스트가 위에서부터 시작되도록 설정 (Android/Web)
    paddingTop: 10,
    marginTop: 10,
  }
});

export default ProductEditor;