import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles';

const ScannerModal = ({ onScan, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

    scanner.render(
      (text) => {
        onScan(text); // 부모 컴포넌트에 바코드 값 전달
        scanner.clear();
      },
      (err) => { /* 스캔 시도 중 오류는 무시 */ }
    );

    return () => {
      scanner.clear().catch(error => console.error("Scanner clear error", error));
    };
  }, [onScan]);

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.h2}>바코드 스캐너</Text>
        <div id="reader"></div>
        <TouchableOpacity
          onPress={onClose}
        >
          <Text style={styles.closeModalBtnText}>
          ✕ 스캔 취소
          </Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

export default ScannerModal;