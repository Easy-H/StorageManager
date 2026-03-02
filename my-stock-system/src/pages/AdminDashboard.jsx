import React from 'react';

const AdminDashboard = ({ products }) => {

  const getStatusColor = (product) => {
    const isOverdue = (new Date() - product.lastCheckedAt.toDate()) / (1000 * 60 * 60 * 24) > 30;
    if (isOverdue) return 'bg-gray-200 text-gray-600'; // 장기 미확인
    if (product.currentStock <= 0) return 'bg-red-100 text-red-600'; // 품절
    if (product.currentStock <= product.safetyStock) return 'bg-orange-100 text-orange-600'; // 안전재고 미달
    return 'bg-green-100 text-green-600'; // 정상
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">전체 재고 현황</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">상품명</th>
            <th className="p-3">현재고</th>
            <th className="p-3">안전재고</th>
            <th className="p-3">마지막 실사</th>
            <th className="p-3">상태</th>
            <th className="p-3">액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-3 font-semibold">{p.name}</td>
              <td className="p-3">{p.currentStock}</td>
              <td className="p-3 text-gray-500">{p.safetyStock}</td>
              <td className="p-3 text-sm text-gray-400">{p.lastCheckedAt.toDate().toLocaleDateString()}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(p)}`}>
                  상태확인
                </span>
              </td>
              <td className="p-3">
                <button 
                  onClick={() => processInventoryEvent(p.id, 'CHECK', 0)}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100"
                >실사완료</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;