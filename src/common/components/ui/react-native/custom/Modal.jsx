import React, { useState, useEffect, useRef } from 'react';
import { Modal as M, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { styles } from '../../../../../styles';

export default function Modal({ visible, children }) {

  return (
    <M visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          { children }
        </View>
      </View>
    </M>
  );
}