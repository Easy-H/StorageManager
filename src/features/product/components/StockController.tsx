import React, { useState } from 'react';
import { TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { vars, Button, PrimaryButton, SecondaryButton, LinkButton } from '../../../common/components/ui-brick';

type StockControllerProps = {
	inputQty: number;
	setInputQty: React.Dispatch<React.SetStateAction<number>>;
	currentStock: number;
	updateStock: (item: any, qty: number, isAudit: boolean, type: string) => void;
	item: any;
}

const StockController = ({ inputQty, setInputQty, currentStock, updateStock, item }: StockControllerProps) => {
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
			<View style={{ alignItems: 'center', justifyContent: 'center', gap: 20, marginVertical: 10, flexDirection: 'row' } as ViewStyle}>
				<Button onPress={handleDecrease} style={circleQtyBtn}>
					-
				</Button>
				<TextInput
					value={String(inputQty)}
					onChange={(e: any) => {
						const val = Number(e.target.value);
						// 직접 입력 모드에서도 0 미만은 입력 불가하도록 방어
						setInputQty(isDirectInput ? Math.max(0, val) : Math.max(1, val));
					}}
					style={{
						textAlign: 'center', width: 70,
						color: vars.text,
						fontSize: 24, borderBottomWidth: 2, borderBottomColor: vars.surface
					} as TextStyle}
				/>
				<Button onPress={handleIncrease} style={circleQtyBtn}>
					+
				</Button>
			</View>

			<View style={{ gap: 10, flexDirection: 'row', justifyContent: 'center' } as ViewStyle}>
				{isDirectInput ? (
					<SecondaryButton
						onPress={() => updateStock(item, inputQty, true, 'ADJUST')}
					>
						이 수량으로 확정 (실사 포함)
					</SecondaryButton>
				) : (
					<>
						<SecondaryButton
							onPress={() => updateStock(item, inputQty, false, 'IN')}
						>
							입고(+)
						</SecondaryButton>
						<PrimaryButton
							onPress={handleOutStock}
							style={{ backgroundColor: inputQty > currentStock ? '#ccc' : vars.primary } as ViewStyle}
						>
							출고(-)
						</PrimaryButton>
					</>
				)}
			</View>

			<LinkButton
				onPress={() => {
					setIsDirectInput(!isDirectInput);
					setInputQty(isDirectInput ? 1 : currentStock);
				}}>
				{isDirectInput ? "◀ 증감 모드로 전환" : "실재고 숫자를 직접 수정"}
			</LinkButton>
		</>
	);
};

export default StockController;

const circleQtyBtn: ViewStyle & TextStyle = {
	width: 45,
	height: 45,
	borderRadius: 22.5,
	borderWidth: 1,
	color: vars.text,
	backgroundColor: vars.background,
	borderColor: vars.surface,
	// @ts-ignore
	cursor: 'pointer',
	padding: 0,
	fontSize: 20,
};