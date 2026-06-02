import React from 'react';
import { TextInput, TextInputProps, StyleProp, TextStyle, StyleSheet } from 'react-native';
import vars from '../../vars';

interface InputTextProps extends TextInputProps {
    style?: StyleProp<TextStyle>;
}

export default function InputText({ style, ...props }: InputTextProps) {
    return (
        <TextInput
            style={[localStyles.inputBasic, style]}
            {...props}
        />
    );
}
const localStyles = StyleSheet.create({

    inputBasic: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: vars.surface,
        fontSize: 20,
        backgroundColor: vars.background,
        color: vars.text,
    },
})
