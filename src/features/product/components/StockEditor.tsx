import React from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { H2 } from '../../../common/components/ui/react-native/common';
import { LinkButton } from '../../../common/components/ui/react-native/custom';
import StockController from './StockController';
import { vars } from '../../../common/components/ui';

type StockEditorProps = {
	item: any;
	lastAuditDisplay: any;
	onAudit: () => void;
	onEditMode: () => void;
	inputQty: number;
	setInputQty: React.Dispatch<React.SetStateAction<number>>;
	updateStock: (item: any, qty: number, isAudit: boolean, type: string) => void;
}

const StockEditor = ({ item, lastAuditDisplay, onAudit, onEditMode, inputQty, setInputQty, updateStock }: StockEditorProps) => {

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } as ViewStyle}>
                <H2>{item.name}</H2>
                <LinkButton onPress={onEditMode}>
                    편집
                </LinkButton>
            </View>

            {item.memo && (
                <View style={memoBoxStyle}>
                    <Text style={memoTextStyle}>{item.memo}</Text>
                </View>
            )}

            <View style={{ backgroundColor: vars.background, borderRadius: 10, padding: 15, alignItems: 'center', gap: 5 } as ViewStyle}>
                <Text style={{ fontSize: 12, color: vars.text } as TextStyle}>현재 실재고</Text>
                <Text style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: item.currentStock <= item.safetyStock ? vars.errorRed : vars.text
                } as TextStyle}>
                    {item.currentStock}개
                </Text>
                <Text style={{ fontSize: 11, color: vars.text, textAlign: 'center' } as TextStyle}>
                    최근 실사: {lastAuditDisplay ? (lastAuditDisplay instanceof Date ? lastAuditDisplay.toLocaleDateString() : new Date(lastAuditDisplay).toLocaleDateString()) : '기록 없음'}
                </Text>
                <TouchableOpacity onPress={onAudit}>
                    <Text style={auditBtnStyle}>✅ 수량 일치 확인 (실사)</Text>
                </TouchableOpacity> 
            </View>

            <StockController inputQty={inputQty} setInputQty={setInputQty} currentStock={item.currentStock} item={item} updateStock={updateStock} />
        </>
    );
};

const memoBoxStyle: ViewStyle = {
    backgroundColor: '#fff9db', // 연한 노란색 (포스트잇 느낌)
    borderLeftWidth: 4,
    borderLeftColor: '#fab005', // 강조 선
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
};

const memoTextStyle: TextStyle = {
    margin: 0,
    fontSize: 13,
    color: '#5c5f66',
    lineHeight: 1.5 * 13,
    // @ts-ignore
    whiteSpace: 'pre-wrap', 
    textAlign: 'left'
};

const auditBtnStyle: TextStyle & ViewStyle = {
    color: '#4a90e2',
    backgroundColor: vars.box,
    borderWidth: 1,
    borderColor: vars.surface,
    borderRadius: 20,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
    // @ts-ignore
    cursor: 'pointer',
    fontSize: 12
};

export default StockEditor;