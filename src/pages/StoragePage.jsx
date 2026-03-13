import React, { useState } from 'react';
import SearchBar from '../common/components/SearchBar';
import ProductList from '../features/product/components/ProductList';
import ScannerModal from '../common/components/ScannerModal';
import ProductDetailModal from '../features/product/components/ProductDetailModal';
import Header from '../common/components/Header';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { styles } from '../styles';

const StoragePage = ({ products, currentOrg, onBack, notice }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice}/>
            <View style={ styles.appContent } >

                <View style={styles.searchSection}>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm} />
                    <View style={{ justifyContent: 'center' }}>
                        <select value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="select-basic">
                            <option value="name">
                                🔤 이름순 정렬</option>
                            <option value="lowStock">
                                ⚠️ 재고 부족순</option>
                            <option value="oldAudit">
                                📅 실사 오래된순</option>
                        </select>
                    </View>
                </View>

                <ProductList products={products} searchTerm={searchTerm} sortBy={sortBy} onSelectProduct={setSelectedItem} />

                <View style={styles.buttonRowFloating}>
                    <TouchableOpacity
                        onPress={() => setSelectedItem({ barcode: '', name: '', isNew: true, currentStock: 0 })}
                        style={styles.greenButton}>
                        <Text style={styles.buttonText}>
                            ➕ 직접 추가</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsScannerOpen(true)} style={styles.blueButton}>
                        <Text style={styles.buttonText}>📷 바코드 스캔</Text>
                    </TouchableOpacity>
                </View>

                {isScannerOpen && (
                    <ScannerModal
                        onScan={(text) => {
                            const found = products.find(p => p.barcode === text);
                            setSelectedItem(found || { barcode: text, name: "", isNew: true, currentStock: 0 });
                            setIsScannerOpen(false);
                        }}
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}

                {selectedItem && (
                    <ProductDetailModal
                        item={selectedItem}
                        orgId={currentOrg.id}
                        onClose={() => setSelectedItem(null)}
                        notice={notice} />
                )}
            </View>
        </>
    );
};

export const localStyle = StyleSheet.create({});

export default StoragePage;