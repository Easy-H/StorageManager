import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ScannerModal from '../../common/components/ScannerModal';
import SearchBar from '../../common/components/SearchBar';
import { PrimaryButton, SecondaryButton } from '../../common/components/ui-brick';

import { OrgMembership } from '../../features/org/types';
import ProductDetailModal from '../../features/product/components/ProductDetailModal';
import ProductList from '../../features/product/components/ProductList';
import { Product } from '../../features/product/types';
import { styles } from '../../styles';

interface StoragePageProps {
    products: Product[];
    currentOrg: OrgMembership;
    onBack: () => void;
    notice: (msg: string) => void;
}

const StoragePage = ({ products, currentOrg, onBack, notice }: StoragePageProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);

    return (
        <>
            <View style={styles.appContent} >

                <View style={styles.searchSection}>
                    <SearchBar
                        placeholder={"품목 이름 검색..."}
                        value={searchTerm}
                        onChange={setSearchTerm} />

                    <PrimaryButton onPress={() => setIsScannerOpen(true)}>
                        📷
                    </PrimaryButton>
                    <SecondaryButton
                        onPress={() => setSelectedItem({ barcode: '', name: '', isNew: true, currentStock: 0 } as any)}
                        >
                        추가
                    </SecondaryButton>
                </View>

                <ProductList products={products} searchTerm={searchTerm} onSelectProduct={(p: Product) => setSelectedItem(p)} />
            </View>

                {isScannerOpen && (
                    <ScannerModal
                        onScan={(text) => {
                            const found = products.find(p => p.barcode === text);
                            setSelectedItem(found || { barcode: text, name: "", isNew: true, currentStock: 0 } as any);
                            setIsScannerOpen(false);
                        }}
                        onClose={() => setIsScannerOpen(false)}
                    />
                )}

            {selectedItem && (
                <ProductDetailModal
                    visible={true}
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