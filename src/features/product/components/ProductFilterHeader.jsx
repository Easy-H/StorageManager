import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FilterButton } from '../../../common/components/ui/react-native/custom/index.js';

const ProductFilterHeader = ({ filterType, setFilterType, counts, sortBy, setSortBy }) => {
	return (
		<View style={localStyles.filterTabContainer}>
			<FilterButton
				onPress={() => setFilterType("ALL")}
				isActive={filterType === "ALL"}>
				전체 ({counts.ALL})
			</FilterButton>

			<FilterButton
				onPress={() => setFilterType("LOW_STOCK")}
				isActive={filterType === "LOW_STOCK"}>
				⚠️ 부족 ({counts.LOW_STOCK})
			</FilterButton>

			<FilterButton
				onPress={() => setFilterType("NEEDS_INSPECTION")}
				isActive={filterType === "NEEDS_INSPECTION"}>
				✅ 점검 ({counts.NEEDS_INSPECTION})
			</FilterButton>

			<FilterButton
				onPress={() => setFilterType("NEEDS_AUDIT")}
				isActive={filterType === "NEEDS_AUDIT"}>
				📅 실사 ({counts.NEEDS_AUDIT})
			</FilterButton>

			<select value={sortBy}
				onChange={(e) => setSortBy(e.target.value)}
				className="select-basic"
				style={localStyles.select}>
				<option value="name">🔤 이름순</option>
				<option value="lowStock">⚠️ 부족순</option>
				<option value="oldAudit">📅 과거순</option>
			</select>
		</View>
	);
};

const localStyles = StyleSheet.create({
	filterTabContainer: {
		flex: 1,
		flexDirection: 'row',
		gap: 6
	},
	select: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px' }
});

export default ProductFilterHeader;