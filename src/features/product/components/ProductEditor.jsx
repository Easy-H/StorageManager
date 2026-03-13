import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { styles } from '../../../styles.js'

const ProductEditor = ({ item, form, setForm, onSave, onDelete, inputQty }) => (
  <View style={styles.formStack}>
    <Text style={styles.h3}>{item.isNew ? "신규 품목 등록" : "정보 수정"}</Text>
    <input 
      value={form.name} 
      onChange={e => setForm({...form, name: e.target.value})} 
      placeholder="품목 이름" 
      className="input-basic" 
    />
    <input 
      value={form.barcode} 
      onChange={e => setForm({...form, barcode: e.target.value})} 
      placeholder="바코드(선택)" 
      className="input-basic" 
    />
    <Text style={{ fontSize: '12', textAlign: 'left', marginTop: '10px' }}>안전 재고 기준 (개)</Text>
    <input 
      type="number" 
      value={form.safetyStock} 
      onChange={e => setForm({...form, safetyStock: Number(e.target.value)})} 
      className="input-basic" 
    />

    
    <View style={[styles.buttonRow, { marginTop: '10px', gap: '8px' }]}>
      <button onClick={() => onSave(item, form, inputQty)} className="green-button" style={{ flex: 2 }}>저장하기</button>
      {!item.isNew && (
        <button onClick={() => onDelete(item)} className="link-button" style={{ color: '#ff4d4f' }}>삭제</button>
      )}
    </View>
  </View>
);

export default ProductEditor;