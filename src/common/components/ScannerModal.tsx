import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles';
import { Modal, LinkButton } from '../components/ui/react-native/custom';

interface ScannerModalProps {
    onScan: (text: string) => void;
    onClose: () => void;
}

const ScannerModal = ({ onScan, onClose }: ScannerModalProps) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

        scanner.render(
            (text: string) => {
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
        <Modal>
            <Text style={styles.h2}>바코드 스캐너</Text>
            {/* @ts-ignore - Web DOM element for scanner library */}
            <div id="reader"></div>
            <LinkButton
                onPress={onClose}>
                ✕ 스캔 취소
            </LinkButton>
        </Modal>
    );
};

export default ScannerModal;