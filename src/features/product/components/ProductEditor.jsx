import React from 'react';
import {
  View, ScrollView, Text,
  StyleSheet, Platform, Dimensions
} from 'react-native';
import { styles } from '../../../styles.js'
import GreenButton from '../../../common/components/ui/react-native/custom/GreenButton.jsx';
import CloseButton from '../../../common/components/ui/react-native/custom/CloseButton.jsx';
import H2 from '../../../common/components/ui/react-native/common/H2.jsx';
import InputText from '../../../common/components/ui/react-native/custom/InputText.jsx';

const ProductEditor = ({ item, form, setForm, onSave, onDelete, inputQty }) => (
  <View style={styles.formStack}>
    <H2>{item.isNew ? "신규 품목 등록" : "정보 수정"}</H2>
    <InputText
      value={form.name}
      onChange={e => setForm({ ...form, name: e.target.value })}
      placeholder="품목 이름"
    />
    <InputText
      value={form.barcode}
      onChange={e => setForm({ ...form, barcode: e.target.value })}
      placeholder="바코드(선택)"
    />
    {item.isNew && (
      <>
      <Text style={{ fontSize: '12', textAlign: 'left', marginTop: '10px' }}>
      최초 입고 수량 (선택)
      </Text>
        <InputText
          type="number"
          value={form.initialStock | 0}
          onChange={e => setForm({ ...form, initialStock: Number(e.target.value) })}
          placeholder="0"
        />
      </>
    )}
    <Text style={{ fontSize: '12', textAlign: 'left', marginTop: '10px' }}>안전 재고 기준 (개)</Text>
    <InputText
      type="number"
      value={form.safetyStock}
      onChange={e => setForm({ ...form, safetyStock: Number(e.target.value) })}
    />

    <InputText
      multiline
      numberOfLines={4}
      value={form.memo}
      onChange={e => setForm({ ...form, memo: e.target.value })}
      placeholder="기타 메모 (보관 방법, 주의사항 등 자유롭게 입력)"
      style={localStyles.memoInput}
    />


    <View style={[styles.buttonRow, { marginTop: '10px', gap: '8px' }]}>
      <GreenButton onPress={() => onSave(item.id, form, inputQty)}
        style={{ flex: 2 }}>
          저장하기
      </GreenButton>
      {!item.isNew && (
        <CloseButton onPress={() => onDelete(item)}
          style={{ justifyContent: 'center', flex: 1, color: '#ff4d4f' }}>
          삭제
        </CloseButton>
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