import React from 'react';
import { styles } from '../../../styles.js'
import { View, ScrollView, Text } from 'react-native';
import { useProductSearch } from '../hooks/useProductSearch.jsx';
import * as Hangul from 'hangul-js';

const getAuditStatus = (lastAuditDate) => {
  if (!lastAuditDate) return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6" };

  // lastAuditDate는 이제 이미 Date 객체입니다.
  const diffTime = Math.abs(new Date() - lastAuditDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return { text: "실사완료", color: "#52c41a", bg: "#f6ffed" };
  if (diffDays <= 30) return { text: "점검예정", color: "#1890ff", bg: "#e6f7ff" };
  return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6" };
};

const ProductList = ({ products, searchTerm, onSelectProduct, sortBy }) => {
  const searchKeyword = searchTerm.toLowerCase().trim();
  const { searchResult } = useProductSearch(products, searchTerm);

  // 1. 검색 필터링
  let displayList = searchResult;

  // 2. 정렬 로직
  displayList.sort((a, b) => {
    if (sortBy === "lowStock") {
      // 재고 부족 정도 계산 (현재재고 - 안전재고)
      const aGap = a.currentStock - (a.safetyStock || 0);
      const bGap = b.currentStock - (b.safetyStock || 0);
      return aGap - bGap; // 부족한 게 위로
    }
    if (sortBy === "oldAudit") {
      // 실사 날짜 비교 (기록 없으면 가장 과거로 처리)
      const aTime = a.lastAudit ? a.lastAudit.getTime() : 0;
      const bTime = b.lastAudit ? b.lastAudit.getTime() : 0;
      return aTime - bTime; // 오래된 게 위로
    }
    // 기본: 이름순
    return a.name.localeCompare(b.name);
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}
      style={styles.productList}>
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
            <View style={{ textAlign: 'right' }}>
              <Text style={{ fontSize: '18px', fontWeight: 'bold', color: isLow ? '#ff4d4f' : '#333' }}>
                {p.currentStock}개
              </Text>
              {isLow && <Text style={{ fontSize: '9px', color: '#ff4d4f', fontWeight: 'bold' }}>재고부족</Text>}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ProductList;