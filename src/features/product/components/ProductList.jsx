import React, { useState } from 'react';
import { styles } from '../../../styles.js'
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useProductSearch } from '../hooks/useProductSearch.jsx';

const getAuditStatus = (lastAuditDate) => {
  if (!lastAuditDate) return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6", needsAudit: true, needsInspection: true };

  const diffTime = Math.abs(new Date() - lastAuditDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return { text: "실사완료", color: "#52c41a", bg: "#f6ffed", needsAudit: false, needsInspection: false };
  if (diffDays <= 30) return { text: "점검예정", color: "#1890ff", bg: "#e6f7ff", needsAudit: false, needsInspection: true };
  return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6", needsAudit: true, needsInspection: true};
};

const ProductList = ({ products, searchTerm, onSelectProduct }) => {
  const { searchResult } = useProductSearch(products, searchTerm);
  const [sortBy, setSortBy] = useState("name");
  const [filterType, setFilterType] = useState("ALL");

  // --- [추가] 각 카테고리별 개수 미리 계산 ---
  const counts = {
    ALL: searchResult.length,
    LOW_STOCK: searchResult.filter(p => p.currentStock <= (p.safetyStock || 0)).length,
    NEEDS_INSPECTION: searchResult.filter(p => getAuditStatus(p.lastAudit).needsInspection).length,
    NEEDS_AUDIT: searchResult.filter(p => getAuditStatus(p.lastAudit).needsAudit).length,
  };

  // 1. 필터링 로직
  let displayList = searchResult.filter(p => {
    if (filterType === "LOW_STOCK") return p.currentStock <= (p.safetyStock || 0);
    if (filterType === "NEEDS_AUDIT") return getAuditStatus(p.lastAudit).needsAudit;
    if (filterType === "NEEDS_INSPECTION") return getAuditStatus(p.lastAudit).needsInspection;
    return true; 
  });

  // 2. 정렬 로직
  displayList.sort((a, b) => {
    if (sortBy === "lowStock") {
      const aGap = a.currentStock - (a.safetyStock || 0);
      const bGap = b.currentStock - (b.safetyStock || 0);
      return aGap - bGap;
    }
    if (sortBy === "oldAudit") {
      const aTime = a.lastAudit ? a.lastAudit.getTime() : 0;
      const bTime = b.lastAudit ? b.lastAudit.getTime() : 0;
      return aTime - bTime;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <View style={localStyles.filterTabContainer}>
          <TouchableOpacity
            onPress={() => setFilterType("ALL")}
            style={[localStyles.filterTab, filterType === "ALL" && localStyles.activeTab]}>
            <Text style={[localStyles.tabText, filterType === "ALL" && localStyles.activeTabText]}>
                전체 ({counts.ALL})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterType("LOW_STOCK")}
            style={[localStyles.filterTab, filterType === "LOW_STOCK" && localStyles.activeTab]}>
            <Text style={[localStyles.tabText, filterType === "LOW_STOCK" && localStyles.activeTabText]}>
                ⚠️ 부족 ({counts.LOW_STOCK})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setFilterType("NEEDS_INSPECTION")}
            style={[localStyles.filterTab, filterType === "NEEDS_INSPECTION" && localStyles.activeTab]}>
            <Text style={[localStyles.tabText, filterType === "NEEDS_INSPECTION" && localStyles.activeTabText]}>
                ✅ 점검 ({counts.NEEDS_INSPECTION})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterType("NEEDS_AUDIT")}
            style={[localStyles.filterTab, filterType === "NEEDS_AUDIT" && localStyles.activeTab]}>
            <Text style={[localStyles.tabText, filterType === "NEEDS_AUDIT" && localStyles.activeTabText]}>
                📅 실사 ({counts.NEEDS_AUDIT})
            </Text>
          </TouchableOpacity>

          <select value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select-basic"
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px' }}>
            <option value="name">🔤 이름순</option>
            <option value="lowStock">⚠️ 부족순</option>
            <option value="oldAudit">📅 과거순</option>
          </select>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.productList}>
        {displayList.map(p => {
          const isLow = p.currentStock <= (p.safetyStock || 0);
          const audit = getAuditStatus(p.lastAudit);

          return (
            <View key={p.id} onClick={() => onSelectProduct(p)} style={styles.productItem}>
              <View style={{ flex: 1 }}>
                <View style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row' }}>
                  <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{p.name}</Text>
                  <Text style={{ fontSize: '10px', color: audit.color, backgroundColor: audit.bg, padding: '2px 5px', borderRadius: '4px' }}>
                    {audit.text}
                  </Text>
                </View>
                <Text style={{ fontSize: '12px', color: '#999' }}>{p.barcode || "N/A"}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: '18px', fontWeight: 'bold', color: isLow ? '#ff4d4f' : '#333' }}>
                  {p.currentStock}개
                </Text>
                {isLow && <Text style={{ fontSize: '10px', color: '#ff4d4f', fontWeight: 'bold' }}>재고부족</Text>}
              </View>
            </View>
          );
        })}
        {displayList.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>조건에 맞는 제품이 없습니다.</Text>
        )}
      </ScrollView>
    </>
  );
};

const localStyles = StyleSheet.create({
  filterTabContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 6 // 간격을 조금 좁혀서 공간 확보
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderColor: '#1890ff',
  },
  tabText: {
    fontSize: 11, // 글자수가 많아지므로 폰트 크기 소폭 조정
    color: '#666',
  },
  activeTabText: {
    color: '#1890ff',
    fontWeight: 'bold',
  }
});

export default ProductList;