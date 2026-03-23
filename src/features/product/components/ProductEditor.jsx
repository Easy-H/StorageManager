import React from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../../../styles.js'

const ProductEditor = ({ item, form, setForm, onSave, onDelete, inputQty }) => (
  <View style={styles.formStack}>
    <Text style={styles.h3}>{item.isNew ? "신규 품목 등록" : "정보 수정"}</Text>
    <TextInput
      value={form.name} 
      onChange={e => setForm({...form, name: e.target.value})} 
      placeholder="품목 이름" 
      style={styles.inputBasic}
    />
    <TextInput
      value={form.barcode} 
      onChange={e => setForm({...form, barcode: e.target.value})} 
      placeholder="바코드(선택)" 
      style={styles.inputBasic}
    />
    <Text style={{ fontSize: '12', textAlign: 'left', marginTop: '10px' }}>안전 재고 기준 (개)</Text>
    <TextInput
      type="number" 
      value={form.safetyStock} 
      onChange={e => setForm({...form, safetyStock: Number(e.target.value)})} 
      style={styles.inputBasic}
    />

    
    <View style={[styles.buttonRow, { marginTop: '10px', gap: '8px' }]}>
      <TouchableOpacity onPress={() => onSave(item.id, form, inputQty)}
        style={[styles.greenButton, { flex: 2 }]}>
        <Text style={styles.buttonText}>저장하기</Text>
      </TouchableOpacity>
      {!item.isNew && (
        <TouchableOpacity onPress={() => onDelete(item)}
          style={{justifyContent: 'center', flex: 1}}>
          <Text style={[styles.linkButton, { color: '#ff4d4f' }]}>삭제</Text>
          </TouchableOpacity>
      )}
    </View>
  </View>
);

export default ProductEditor;