import React from 'react';
import { TextInput, TextInputProps, StyleProp, TextStyle } from 'react-native';
import { styles } from '../../../../../styles';

interface InputTextProps extends TextInputProps {
    style?: StyleProp<TextStyle>;
}

export default function InputText({ style, ...props }: InputTextProps) {
    return (
        <TextInput
            style={[styles.inputBasic, style]}
            {...props}
        />
    );
}