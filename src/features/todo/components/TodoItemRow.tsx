import { StyleSheet, View } from 'react-native';
import { Button, InputText } from '../../../common/components/ui-brick';
import { Colors } from '../../../styles';
import { StockUpdateItem } from '../../product/types';

type TodoItemRowProps = {
	item: StockUpdateItem;
	onPressPick: () => void;
	onPressRegister: () => void;
	onUpdateQuantity: (quantity: number) => void;
	onRemove: () => void;
}

const TodoItemRow = ({ item, onPressPick, onPressRegister, onUpdateQuantity, onRemove }: TodoItemRowProps) => {
	const isUnknown = !item.productId;

	return (
		<View style={[localStyles.itemRow, isUnknown && localStyles.unknownRow]}>
			{/* 제품 선택 또는 이름 표시 */}
			<Button
				style={[
					localStyles.productPick,
					{
						flex: 1,
						color: isUnknown ? Colors.errorRed : '#333',
						fontWeight: isUnknown ? 'bold' : 'normal'
					}
				]}
				onPress={onPressPick}
			>
				{item.name || "제품 선택..."} {isUnknown && "(미등록)"}
			</Button>

			{/* 미등록 시 등록 버튼 노출 */}
			{!!(item.name && isUnknown) && (
				<Button
					onPress={onPressRegister}
					style={[localStyles.miniRegisterBtn, { color: '#fff', padding: 5 }]}>
					등록
				</Button>
			)}

			{/* 수량 입력 */}
			<InputText
				style={{ width: 80, textAlign: 'center' }}
				keyboardType="numeric"
				value={String(item.quantity)}
				onChangeText={(v: string) => onUpdateQuantity(Number(v) || 0)}
			/>

			{/* 행 삭제 */}
			<Button onPress={onRemove} style={{ padding: 5, color: Colors.errorRed }}>
				❌
			</Button>
		</View>
	);
};

const localStyles = StyleSheet.create({
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingVertical: 5,
		//justifyContent: 'stretch'
	},
	unknownRow: {
		backgroundColor: '#fff1f0',
		borderRadius: 4 
	},
	productPick: { 
		padding: 8, 
		backgroundColor: '#f9f9f9', 
		borderRadius: 4, 
		borderWidth: 1, 
		borderColor: '#eee' 
	},
	miniRegisterBtn: { 
		backgroundColor: Colors.primary, 
		paddingVertical: 4, 
		paddingHorizontal: 8, 
		borderRadius: 4 
	}
});

export default TodoItemRow;