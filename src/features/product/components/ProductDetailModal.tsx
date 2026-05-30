import React, { useEffect, useState } from 'react';

import { LinkButton, Modal } from '../../../common/components/ui/react-native/custom';
import { useProductActions } from '../hooks/useProductActions';

import ProductEditor from './ProductEditor';
import StockEditor from './StockEditor';
import { Product } from '../types';

interface ProductDetailModalProps {
	visible: boolean;
	item: Product;
	initialName: string;
	orgId: string;
	onClose: () => void;
	notice: (msg: string) => void;
}

const ProductDetailModal = ({ visible, item, initialName, orgId, onClose, notice }: ProductDetailModalProps) => {
	const [editMode, setEditMode] = useState(item.isNew || false);
	const [inputQty, setInputQty] = useState(item.isNew ? 0 : 1);
	const [lastAuditDisplay, setLastAuditDisplay] = useState(item.lastAudit);
	const [form, setForm] = useState({
		name: item.name || initialName,
		barcode: item.barcode || "",
		memo: item.memo || "",
		safetyStock: item.safetyStock ?? 2
	});

	const { saveItem, deleteItem, updateStock, auditItem } = useProductActions(orgId, notice, onClose);

	useEffect(() => {
		setLastAuditDisplay(item.lastAudit);
	}, [item.lastAudit]);

	const handleAuditClick = async () => {
		await auditItem(item);
		setLastAuditDisplay(new Date());
	};

	return (
		<Modal visible={visible}>
			{editMode ? (
				<ProductEditor
					item={item}
					form={form}
					setForm={setForm}
					onSave={saveItem}
					onDelete={deleteItem}
					inputQty={inputQty}
				/>
			) : (
				<StockEditor
					item={item}
					lastAuditDisplay={lastAuditDisplay}
					onAudit={handleAuditClick}
					onEditMode={() => setEditMode(true)}
					inputQty={inputQty}
					setInputQty={setInputQty}
					updateStock={updateStock}
				/>
			)}

			<LinkButton
				onPress={() => (
					editMode && !item.isNew ? setEditMode(false) : onClose())}>
				{editMode && !item.isNew ? "이전으로" : "닫기"}
			</LinkButton>
		</Modal>
	);
};

export default ProductDetailModal;