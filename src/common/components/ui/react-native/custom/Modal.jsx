import React, { useState, useEffect, useRef } from 'react';
import { Modal as M, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../../../../styles';


const localStyles = {
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: Colors.white,
    width: '100%',
    maxWidth: 400,
    padding: 25,
    gap: 20,
    borderRadius: 20,
  }
}

export default function Modal({ visible, children }) {

  return (
    <M visible={visible} transparent animationType="fade">
      <View style={localStyles.modalOverlay}>
        <View style={localStyles.modalContent}>
          {children}
        </View>
      </View>
    </M>
  );
}