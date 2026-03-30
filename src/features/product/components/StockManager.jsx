import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../../../styles';
import StockController from './StockController';

const StockManager = ({ item, lastAuditDisplay, onAudit, onEditMode, inputQty, setInputQty, updateStock }) => {

    return (
        <>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.h2}>{item.name}</Text>
                <TouchableOpacity onPress={onEditMode}>
                    <Text style={styles.closeModalBtnText}>편집</Text></TouchableOpacity>
            </View>

            {item.memo && (
                <View style={memoBoxStyle}>
                    <p style={memoTextStyle}>{item.memo}</p>
                </View>
            )}

            <View style={{ background: '#f5f5f5', borderRadius: '10px', padding: '15px', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontSize: 12, color: '#666' }}>현재 실재고</Text>
                <Text style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: item.currentStock <= item.safetyStock ? '#ff4d4f' : '#333'
                }}>
                    {item.currentStock}개
                </Text>
                <Text style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>
                    최근 실사: {lastAuditDisplay ? lastAuditDisplay.toLocaleDateString() : '기록 없음'}
                </Text>
                <TouchableOpacity onPress={onAudit}>
                    <Text style={auditBtnStyle}>✅ 수량 일치 확인 (실사)</Text>
                </TouchableOpacity>
            </View>

            <StockController inputQty={inputQty} setInputQty={setInputQty} currentStock={item.currentStock} item={item} updateStock={updateStock} />
        </>
    );
};

const memoBoxStyle = {
    background: '#fff9db', // 연한 노란색 (포스트잇 느낌)
    borderLeft: '4px solid #fab005', // 강조 선
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

const memoTextStyle = {
    margin: 0,
    fontSize: 13,
    color: '#5c5f66',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap', // 줄바꿈 유지
    textAlign: 'left'
};

const auditBtnStyle = {
    color: '#4a90e2',
    background: "white",
    border: '1px solid #ddd',
    borderRadius: 20,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
    cursor: 'pointer',
    fontSize: 12
};

export default StockManager;