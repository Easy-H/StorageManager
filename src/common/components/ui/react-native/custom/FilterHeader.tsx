import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import FilterButton from './FilterButton';

export interface FilterTab {
    label: string;
    value: string;
    count: number;
}

interface FilterHeaderProps {
    tabs: FilterTab[];
    activeTab: string;
    onTabChange: (value: any) => void;
    // 정렬 관련 (선택사항)
    sortBy?: string;
    setSortBy?: (value: string) => void;
    sortOptions?: { label: string; value: string }[];
}

const FilterHeader = ({
    tabs,
    activeTab,
    onTabChange,
    sortBy,
    setSortBy,
    sortOptions,
}: FilterHeaderProps) => {
    return (
        <View style={localStyles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={localStyles.scrollArea}
                contentContainerStyle={localStyles.tabsContainer}
            >
                {tabs.map((tab) => (
                    <FilterButton
                        key={tab.value}
                        onPress={() => onTabChange(tab.value)}
                        isActive={activeTab === tab.value}
                    >
                        {tab.label} ({tab.count})
                    </FilterButton>
                ))}
            </ScrollView>

            {sortBy !== undefined && setSortBy && sortOptions && (
                /* @ts-ignore - Web select tag support */
                <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="select-basic"
                    style={localStyles.select as any}
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 5,
        width: '100%',
    },
    scrollArea: {
        flex: 1,
    },
    tabsContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        gap: 8,
    },
    select: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd',
        fontSize: 12,
    },
});

export default FilterHeader;