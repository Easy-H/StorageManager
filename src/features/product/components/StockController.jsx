import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors, styles } from '../../../styles';

const StockController = ({ inputQty, setInputQty, currentStock, updateStock, item }) => {
  const [isDirectInput, setIsDirectInput] = useState(false);

  const handleDecrease = () => setInputQty(q => isDirectInput ? Math.max(0, q - 1) : Math.max(1, q - 1));
  const handleIncrease = () => setInputQty(q => q + 1);

  // ✨ 출고 전 검증 로직
  const handleOutStock = () => {
    if (inputQty > currentStock) {
      alert(`재고가 부족합니다! (현재: ${currentStock}개 / 요청: ${inputQty}개)`);
      return;
    }
    updateStock(item, inputQty, false, 'OUT');
  };

  return (
    <>
      <View className="qty-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginVertical: 10, flexDirection: 'row' }}>
        <TouchableOpacity onPress={handleDecrease} style={circleQtyBtn}>
          <Text style={circleQtyBtnText}>-</Text>
        </TouchableOpacity>
        <TextInput
          type="number"
          value={inputQty}
          onChange={e => {
            const val = Number(e.target.value);
            // 직접 입력 모드에서도 0 미만은 입력 불가하도록 방어
            setInputQty(isDirectInput ? Math.max(0, val) : Math.max(1, val));
          }}
          style={{ textAlign: 'center', width: 70,
            color: 'black',
            fontSize: 24, border: 'none', borderBottomWidth: 2,
            borderBottomStyle: 'solid', borderBottomColor: '#ddd',
            background: 'transparent' }}
        />
        <TouchableOpacity onPress={handleIncrease} style={circleQtyBtn}>
          <Text style={circleQtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <View className="TouchableOpacity-row" style={{ display: 'flex', gap: 10, flexDirection: 'row', justifyContent: 'center' }}>
        {isDirectInput ? (
          <TouchableOpacity
            onPress={() => updateStock(item, inputQty, true, 'ADJUST')}
            style={styles.greenButton}
          >
            <Text style={styles.buttonText}>이 수량으로 확정 (실사 포함)</Text>

          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => updateStock(item, inputQty, false, 'IN')}
              style={styles.greenButton}
            >
              <Text style={styles.buttonText}>입고(+)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOutStock} // ✨ 검증 함수로 교체
              className="blue-TouchableOpacity"
              style={[styles.blueButton, { backgroundColor: inputQty > currentStock ? '#ccc' : Colors.primary }]}
            >
              <Text style={styles.buttonText}>출고(-)</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          setIsDirectInput(!isDirectInput);
          setInputQty(isDirectInput ? 1 : currentStock);
        }}>
        <Text style={styles.closeModalBtnText}>{isDirectInput ? "◀ 증감 모드로 전환" : "실재고 숫자를 직접 수정"}</Text>
      </TouchableOpacity>
    </>
  );
};

export default StockController;
const circleQtyBtn = {
  width: 45,
  height: 45,
  borderRadius: '50%',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: Colors.borderColor,
  fontSize: 20,
  alignItems: 'center',
  cursor: 'pointer',
  padding: 0,
}

const circleQtyBtnText = {
  fontSize: 20,
  flex: 1,
  alignContent: 'center',
}