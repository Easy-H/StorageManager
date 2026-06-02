import React from 'react';
import { Modal as M, View, StyleSheet, ViewStyle } from 'react-native';
import vars from '../../vars';

type ModalProps = {
  visible?: boolean;
  children: React.ReactNode;
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  } as ViewStyle,
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 25,
    gap: 20,
    borderRadius: 20,
  } as ViewStyle,
});

export default function Modal({ visible, children }: ModalProps) {
  return (
    <M visible={visible} transparent animationType="fade">
      <View style={localStyles.modalOverlay}>
        <View style={[localStyles.modalContent, {backgroundColor: vars.box,}]}>
          {children}
        </View>
      </View>
    </M>
  );
}