import React, { useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { processInventoryEvent } from '../firebase';

const WarehouseView = () => {
  const [mode, setMode] = useState('IN'); // IN or OUT
  const [lastScanned, setLastScanned] = useState(null);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(async (decodedText) => {
      const success = await processInventoryEvent(decodedText, mode);
      if (success) {
        setLastScanned(decodedText);
        // 성공 사운드 피드백 (기획서 반영)
        new Audio('/success.mp3').play();
      }
    });
  };

  return (
    <div className="p-4 flex flex-col items-center" style={{display:"flex", flexDirection: "column"}}>
      <h2 className="text-2xl font-bold mb-4">창고 작업 모드</h2>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setMode('IN')}
          className={`px-8 py-4 rounded-lg text-xl ${mode === 'IN' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >입고 (+1)</button>
        <button 
          onClick={() => setMode('OUT')}
          className={`px-8 py-4 rounded-lg text-xl ${mode === 'OUT' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
        >출고 (-1)</button>
      </div>

      <div id="reader" className="w-full max-w-md border-2 border-dashed border-gray-400 p-2"></div>
      
      {lastScanned && (
        <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded">
          마지막 스캔 성공: <strong>{lastScanned}</strong>
        </div>
      )}
    </div>
  );
};


export default WarehouseView;