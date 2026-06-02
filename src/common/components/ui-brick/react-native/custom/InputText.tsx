import React from 'react';
import { TextInput, TextInputProps, StyleProp, TextStyle, StyleSheet } from 'react-native';
import vars from '../../vars';

interface InputTextProps extends TextInputProps {
    style?: StyleProp<TextStyle>;
}

export default function InputText({ style, ...props }: InputTextProps) {
    return (
        <TextInput
            style={[localStyles.inputBasic,
            {
                borderColor: vars.surface,
                backgroundColor: vars.background,
                color: vars.text,

            },
                style]}
            {...props}
        />
    );
}
const localStyles = StyleSheet.create({

    inputBasic: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 20,
    },
})
