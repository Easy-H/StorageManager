import {
	StyleSheet,
	Text,
	TextStyle,
	View
} from 'react-native';
import { H2 } from '../../../common/components/ui/react-native/common';
import { GreenButton, InputText, LinkButton } from '../../../common/components/ui/react-native/custom';
import { Colors, styles } from '../../../styles';
import { Product } from '../types';

type ProductEditorProps = {
	item: Product;
	form: {
		name: string;
		barcode: string;
		memo: string;
		safetyStock: number;
		initialStock?: number;
	};
	setForm: (form: any) => void;
	onSave: (id: string, form: any, inputQty: number) => void;
	onDelete: (item: Product) => void;
	inputQty: number;
}

const ProductEditor = ({ item, form, setForm, onSave, onDelete, inputQty }: ProductEditorProps) => (
	<View style={styles.formStack}>
		<H2>{item.isNew ? "신규 품목 등록" : "정보 수정"}</H2>
		<InputText
			value={form.name}
			onChange={(e: any) => setForm({ ...form, name: e.target.value })}
			placeholder="품목 이름"
		/>
		<InputText
			value={form.barcode}
			onChange={(e: any) => setForm({ ...form, barcode: e.target.value })}
			placeholder="바코드(선택)"
		/>
		{item.isNew && (
			<>
				<Text style={localStyles.formLabel}>
					최초 입고 수량 (선택)
				</Text>
				<InputText
					value={String(form.initialStock || 0)}
					onChange={(e: any) => setForm({ ...form, initialStock: Number(e.target.value) })}
					placeholder="0"
				/>
			</>
		)}
		<Text style={localStyles.formLabel}>안전 재고 기준 (개)</Text>
		<InputText
			value={String(form.safetyStock)}
			onChange={(e: any) => setForm({ ...form, safetyStock: Number(e.target.value) })}
		/>

		<InputText
			multiline
			numberOfLines={4}
			value={form.memo}
			onChange={(e: any) => setForm({ ...form, memo: e.target.value })}
			placeholder="기타 메모 (보관 방법, 주의사항 등 자유롭게 입력)"
			style={localStyles.memoInput}
		/>

		<View style={[styles.buttonRow, localStyles.buttonArea]}>
			<GreenButton onPress={() => onSave(item.id, form, inputQty)}
				style={localStyles.saveButton}>
				저장하기
			</GreenButton>
			{!item.isNew && (
				<LinkButton onPress={() => onDelete(item)}
					style={localStyles.deleteButton}>
					삭제
				</LinkButton>
			)}
		</View>
	</View>
);

const localStyles = StyleSheet.create({
	formLabel: {
		fontSize: 12,
		textAlign: 'left',
		marginTop: 10,
		color: '#666',
	} as TextStyle,
	memoInput: {
		height: 100, // 여러 줄 입력을 위한 충분한 높이
		textAlignVertical: 'top', // 텍스트가 위에서부터 시작되도록 설정 (Android/Web)
		paddingTop: 10,
		marginTop: 10,
	},
	buttonArea: {
		marginTop: 10,
		gap: 8,
	},
	saveButton: {
		flex: 2,
	},
	deleteButton: {
		justifyContent: 'center',
		flex: 1,
		color: Colors.errorRed,
	} as TextStyle,
});

export default ProductEditor;