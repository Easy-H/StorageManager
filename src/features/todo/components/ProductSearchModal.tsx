import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { H2 } from '../../../common/components/ui/react-native/common';
import { LinkButton, InputText, Modal, BlueButton } from '../../../common/components/ui/react-native/custom';
import { styles } from '../../../styles';
import ScannerModal from '../../../common/components/ScannerModal';
import { useProductSearch } from '../../product/hooks/useProductSearch';
import { Product } from '../../product/types';
import { TodoItem } from '../types';

interface ProductSearchModalProps {
	onClose: () => void;
	onSelect: (item: Product | { id: null; name: string }) => void;
	products: Product[];
	productSelected: TodoItem[];
}

export default function ProductSearchModal({ 
	onClose, 
	onSelect, 
	products, 
	productSelected 
}: ProductSearchModalProps) {
	const [searchKeyword, setKeyword] = useState('');
	const [isScannerOpen, setIsScannerOpen] = useState(false);
	const [debouncedKeyword, setDebouncedKeyword] = useState('');

	// 디바운스 로직: 입력이 발생하고 300ms 동안 추가 입력이 없으면 검색어 업데이트
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedKeyword(searchKeyword);
		}, 300);

		return () => {
			clearTimeout(timer);
		};
	}, [searchKeyword]);

	const { searchResult } = useProductSearch(products, debouncedKeyword);

	// --- [추가] 중복 제외 필터링 로직 ---
	const selectedIds = useMemo(() => 
		(productSelected || []).map(p => p.productId).filter(id => id !== null),
	[productSelected]);

	// 검색 결과 중 이미 선택된 ID를 가진 제품은 제외 (메모이제이션 적용)
	const filteredResult = useMemo(() => 
		searchResult.filter(item => !selectedIds.includes(item.id)),
	[searchResult, selectedIds]);

	// renderItem 메모이제이션으로 불필요한 재렌더링 방지
	const renderItem = useCallback(({ item }: { item: Product }) => (
		<TouchableOpacity
			onPress={() => {
				onSelect(item);
				setKeyword('');
				onClose();
			}}
			style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' } as ViewStyle}
		>
			<Text style={{ fontSize: 16, fontWeight: '500' } as TextStyle}>{item.name}</Text>
			<Text style={{ fontSize: 12, color: '#888' } as TextStyle}>현재 재고: {item.currentStock}</Text>
		</TouchableOpacity>
	), [onSelect, onClose]);

	// --- 스캔 핸들러 ---
	const handleScan = (barcode: string) => {
		const found = products.find(p => p.barcode === barcode);
		if (found) {
			// 이미 선택된 항목인지 확인
			if (!selectedIds.includes(found.id)) {
				onSelect(found);
				onClose();
			} else {
				// 이미 추가된 항목이면 검색어로 설정하여 사용자에게 보여줌
				setKeyword(found.name);
			}
		} else {
			// DB에 없는 경우 바코드를 이름으로 임시 추가
			onSelect({ id: null, name: barcode });
			onClose();
		}
		setIsScannerOpen(false);
	};

	return (
		<Modal visible={true}>
			<H2>제품 선택 (중복 제외)</H2>
			<View style={styles.searchSection}>
				<InputText
					placeholder="제품명 검색..."
					value={searchKeyword}
					onChangeText={setKeyword}
					style={{ flex: 1 }}
				/>
				<BlueButton onPress={() => setIsScannerOpen(true)}>📷</BlueButton>
			</View>
			<View style={{ backgroundColor: '#fff', borderRadius: 10, maxHeight: '100%' } as ViewStyle}>
				<FlatList
					// 검색 결과 대신 필터링된 결과를 사용합니다.
					data={filteredResult}
					keyExtractor={(item) => item.id}
					style={{ maxHeight: 300, minHeight: 300 } as ViewStyle}
					contentContainerStyle={{ gap: 5 }}
					renderItem={renderItem}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}

					ListEmptyComponent={() => (
						<View style={{ padding: 20, alignItems: 'center' } as ViewStyle}>
							{searchKeyword.trim().length > 0 ? (
								<>
									<Text style={{ color: '#888', marginBottom: 10 } as TextStyle}>검색 결과가 없거나 이미 추가된 제품입니다.</Text>
									<TouchableOpacity
										style={styles.primaryButton}
										onPress={() => {
											// 임시 추가 시에는 중복 체크 로직이 없으므로 바로 진행
											onSelect({ id: null, name: searchKeyword });
											setKeyword('');
											onClose();
										}}
									>
										<Text style={{ color: '#fff' } as TextStyle}>'{searchKeyword}' (으)로 임시 추가</Text>
									</TouchableOpacity>
								</>
							) : (
								<Text style={{ color: '#999' } as TextStyle}>검색어를 입력해주세요.</Text>
							)}
						</View>
					)}
				/>
			</View>
			<LinkButton onPress={onClose}>
				닫기
			</LinkButton>

			{isScannerOpen && (
				<ScannerModal 
					onScan={handleScan} 
					onClose={() => setIsScannerOpen(false)} 
				/>
			)}
		</Modal>
	);
}