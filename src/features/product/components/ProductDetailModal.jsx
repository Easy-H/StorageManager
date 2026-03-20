import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useProductActions } from '../hooks/useProductActions.jsx';
import ProductEditor from './ProductEditor.jsx';
import StockManager from './StockManager.jsx';
import { styles } from '../../../styles.js'

const ProductDetailModal = ({ item, orgId, onClose, notice }) => {
	const [editMode, setEditMode] = useState(item.isNew || false);
	const [inputQty, setInputQty] = useState(item.isNew ? 0 : 1);
	const [lastAuditDisplay, setLastAuditDisplay] = useState(item.lastAudit);
	const [form, setForm] = useState({
		name: item.name || "",
		barcode: item.barcode || "",
		safetyStock: item.safetyStock ?? 2
	});

	const { saveItem, deleteItem, updateStock, auditItem } = useProductActions(orgId, notice, onClose);

	useEffect(() => {
		setLastAuditDisplay(item.lastAudit);
	}, [item.lastAudit]);

	const handleAuditClick = async () => {
		const success = await auditItem(item);
		if (success) setLastAuditDisplay(new Date());
	};

	return (
		<View style={styles.modalOverlay}>
			<View style={styles.modalContent}>
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
					<StockManager
						item={item}
						lastAuditDisplay={lastAuditDisplay}
						onAudit={handleAuditClick}
						onEditMode={() => setEditMode(true)}
						inputQty={inputQty}
						setInputQty={setInputQty}
						updateStock={updateStock}
					/>
				)}

				<TouchableOpacity
					onPress={() => (editMode && !item.isNew ? setEditMode(false) : onClose())}
					style={styles.closeModalBtn}>
						<Text style={styles.closeModalBtnText}>
							{editMode && !item.isNew ? "이전으로" : "닫기"}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProductDetailModal;