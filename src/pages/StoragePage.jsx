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
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice} />
            <View style={styles.appContent} >

                <View style={styles.searchSection}>
                    <SearchBar
                        placeholder={"품목 이름 검색..."}
                        value={searchTerm}
                        onChange={setSearchTerm} />

                    <TouchableOpacity onPress={() => setIsScannerOpen(true)} style={styles.blueButton}>
                        <Text style={styles.buttonText}>📷</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSelectedItem({ barcode: '', name: '', isNew: true, currentStock: 0 })}
                        style={styles.greenButton}>
                        <Text style={styles.buttonText}>
                            추가</Text>
                    </TouchableOpacity>
                </View>

                <ProductList products={products} searchTerm={searchTerm} onSelectProduct={setSelectedItem} />
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
                    initialName={searchTerm}
                    orgId={currentOrg.id}
                    onClose={() => setSelectedItem(null)}
                    notice={notice} />
            )}
        </>
    );
};

export const localStyle = StyleSheet.create({});

export default StoragePage;