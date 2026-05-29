import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, H3 } from '../../../common/components/ui/react-native/common';
import { Colors } from '../../../styles';
import { StockUpdateType } from '../../product/types';

interface TodoTypeSelectorProps {
	type: StockUpdateType;
	setType: (type: StockUpdateType) => void;
}

const TodoTypeSelector = ({ type, setType }: TodoTypeSelectorProps) => {
	return (
		<View style={localStyles.sectionRow}>
			<H3>거래 유형</H3>
			<View style={localStyles.typeButtonGroup}>
				<Button
					onPress={() => setType('IN')}
					style={[
						localStyles.typeBtn,
						type === 'IN' && { backgroundColor: Colors.primary, borderColor: Colors.primary, color: '#fff' }
					]}>
					입고 (+)
				</Button>
				<Button
					onPress={() => setType('OUT')}
					style={[
						localStyles.typeBtn,
						type === 'OUT' && { backgroundColor: Colors.errorRed, borderColor: Colors.errorRed, color: '#fff' }
					]}>
					출고 (-)
				</Button>
			</View>
		</View>
	);
};

const localStyles = StyleSheet.create({
	sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
	typeButtonGroup: { flexDirection: 'row', gap: 5 },
	typeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 },
});

export default TodoTypeSelector;