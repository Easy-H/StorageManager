import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import ScannerModal from '../components/ScannerModal';
import ProductDetailModal from '../components/ProductDetailModal';
import Header from '../components/Header';

const StoragePage = ({ products, currentOrg, onBack, notice }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // 조직 코드 복사 기능
    const handleCopyOrgId = (id) => {
        if (!id) return;
        navigator.clipboard.writeText(id)
            .then(() => notice("조직 코드가 복사되었습니다!"))
            .catch(() => notice("복사 실패"));
    };

    return (
        <>
            <Header currentOrg={currentOrg} onBack={onBack} notice={notice}/>
            <div className="app-wrapper">

                <div className="search-sort-section" style={{ padding: '10px 15px 0', display: 'flex' }}>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    <div style={{ height: "40px", padding: "12px 0" }}>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-basic">
                            <option value="name">🔤 이름순 정렬</option>
                            <option value="lowStock">⚠️ 재고 부족순</option>
                            <option value="oldAudit">📅 실사 오래된순</option>
                        </select>
                    </div>
                </div>

                <ProductList products={products} searchTerm={searchTerm} sortBy={sortBy} onSelectProduct={setSelectedItem} />

                <div className="button-row-floating">
                    <button onClick={() => setSelectedItem({ barcode: '', name: '', isNew: true, currentStock: 0 })} className="green-button-pill">➕ 직접 추가</button>
                    <button onClick={() => setIsScannerOpen(true)} className="floating-scan-btn">📷 바코드 스캔</button>
                </div>

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
                    <ProductDetailModal item={selectedItem} orgId={currentOrg.id} onClose={() => setSelectedItem(null)} notice={notice} />
                )}
            </div>
        </>
    );
};

export default StoragePage;