import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, H2 } from '../../../common/components/ui/react-native/common';
import { BlueButton, GreenButton, InputText, LinkButton, Modal } from '../../../common/components/ui/react-native/custom';
import { Colors, styles } from '../../../styles';
import { Product, StockUpdateItem, StockUpdateType } from '../../product/types';
import { Todo } from '../types';
import TodoModalItemList from './TodoModalItemList';
import ProductSearchModal from './ProductSearchModal';
import TodoTypeSelector from './TodoTypeSelector';

interface TodoModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (data: { title: string; type: StockUpdateType; items: StockUpdateItem[] }) => void;
	onExecute: (todo: Todo) => void;
	onDelete: (id: string) => void;
	onRegisterProduct: (name: string) => Promise<string | null>;
	initialData: Todo | null;
	initialName: string;
	products: Product[];
}

export default function TodoModal({
	visible,
	onClose,
	onSave,
	onExecute,
	onDelete,
	onRegisterProduct,
	initialData,
	initialName,
	products
}: TodoModalProps) {
	const [title, setTitle] = useState(initialName);
	const [type, setType] = useState<StockUpdateType>('IN');
	const [items, setItems] = useState<StockUpdateItem[]>([]);
	const [searchModalVisible, setSearchModalVisible] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	useEffect(() => {
		if (visible) {
			if (initialData) {
				setTitle(initialData.title || '');
				setType(initialData.type || 'IN');
				setItems(initialData.items || []);
			} else {
				setTitle(initialName);
				setType('IN');
				setItems([]);
			}
		}
	}, [initialData, visible, initialName]);

	const handleRegisterNew = async (index: number) => {
		const item = items[index];
		if (!item.name) return alert("상품명이 필요합니다.");

		if (window.confirm(`'${item.name}'을(를) 시스템에 새 상품으로 등록하시겠습니까?`)) {
			try {
				const newId = await onRegisterProduct(item.name);
				if (newId) {
					const next = [...items];
					next[index].productId = newId;
					setItems(next);
					alert("성공적으로 등록 및 연결되었습니다.");
				}
			} catch (e) {
				alert("등록 중 오류가 발생했습니다.");
			}
		}
	};

	const handleSave = () => {
		const validItems = items.filter(item => item.productId && Number(item.quantity) > 0);

		if (validItems.length === 0) {
			return alert("연결된 유효 품목이 없습니다. 모든 품목을 연결하거나 등록해주세요.");
		}

		onSave({ title, type, items: validItems });
		onClose();
	};

	return (
		<Modal visible={visible}>
			<H2>{initialData ? "할 일 관리" : "새 할 일 등록"}</H2>

			<View style={{ marginBottom: 15 }}>
				<InputText
					placeholder="할 일 제목 (예: 3월 20일 입고분)"
					value={title}
					onChangeText={setTitle}
				/>
			</View>

			<TodoTypeSelector type={type} setType={setType} />
			<TodoModalItemList
				items={items}
				onAddItem={() => setItems([...items, { productId: '', name: '', quantity: 1 }])}
				onUpdateQuantity={(index, q) => {
					const next = [...items];
					next[index].quantity = q;
					setItems(next);
				}}
				onRemoveItem={(index) => setItems(items.filter((_, i) => i !== index))}
				onPressPick={(index) => {
					setActiveIndex(index);
					setSearchModalVisible(true);
				}}
				onRegisterNew={handleRegisterNew}
			/>

			<View style={{ gap: 20 }}>
				{initialData && (
					<BlueButton style={{ width: '100%' }}
						onPress={() => { onExecute(initialData); onClose(); }}>
						재고에 최종 반영(실행)
					</BlueButton>
				)}

				<View style={styles.buttonRow}>
					<GreenButton style={{ flex: 2 }} onPress={handleSave}>
						{initialData ? "변경사항 저장" : "할 일 등록하기"}
					</GreenButton>
					{initialData && (
						<Button
							onPress={() => { onDelete(initialData.id); onClose(); }}
							style={{ flex: 1, alignItems: 'center', justifyContent: 'center', color: Colors.errorRed, fontWeight: 'bold' }}>
							삭제
						</Button>
					)}
				</View>
				<LinkButton onPress={onClose}>닫기</LinkButton>
			</View>

			{searchModalVisible && activeIndex !== null && (
				<ProductSearchModal
					products={products}
					productSelected={items}
					onSelect={(p: Product) => {
						const next = [...items];
						next[activeIndex] = { productId: p.id, name: p.name, quantity: 1 };
						setItems(next);
					}}
					onClose={() => setSearchModalVisible(false)}
				/>
			)}
		</Modal>
	);
}

const localStyles = StyleSheet.create({
});