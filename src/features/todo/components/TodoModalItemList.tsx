import React, { useRef } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Button, H3 } from '../../../common/components/ui/react-native/common';
import { Colors } from '../../../styles';
import { StockUpdateItem } from '../../product/types';
import TodoItemRow from './TodoItemRow';

interface TodoModalItemListProps {
	items: StockUpdateItem[];
	onAddItem: () => void;
	onUpdateQuantity: (index: number, quantity: number) => void;
	onRemoveItem: (index: number) => void;
	onPressPick: (index: number) => void;
	onRegisterNew: (index: number) => void;
}

const TodoModalItemList = ({
	items,
	onAddItem,
	onUpdateQuantity,
	onRemoveItem,
	onPressPick,
	onRegisterNew
}: TodoModalItemListProps) => {
	const scrollViewRef = useRef<ScrollView>(null);

	return (
		<View style={{ flex: 1 }}>
			<View style={localStyles.itemHeader}>
				<H3>품목 리스트 ({items.length})</H3>
				<Button onPress={onAddItem} style={{ color: Colors.primary, fontWeight: 'bold' }}>
					+ 추가
				</Button>
			</View>
			<ScrollView
				ref={scrollViewRef}
				style={{ maxHeight: 150, minHeight: 150 }}
				onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
			>
				{items.map((item, index) => (
					<TodoItemRow
						key={index}
						item={item}
						onPressPick={() => onPressPick(index)}
						onPressRegister={() => onRegisterNew(index)}
						onUpdateQuantity={(q) => onUpdateQuantity(index, q)}
						onRemove={() => onRemoveItem(index)}
					/>
				))}
				{items.length === 0 && (
					<Text style={{ textAlign: 'center', color: '#ccc', marginVertical: 20 }}>등록된 품목이 없습니다.</Text>
				)}
			</ScrollView>
		</View>
	);
};

const localStyles = StyleSheet.create({
	itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

export default TodoModalItemList;