import React from 'react';
import { styles } from '../../styles';
import { View, TextInput, ViewStyle, StyleSheet } from 'react-native';
import { vars } from './ui';

interface SearchBarProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
    <View style={{ flex: 4 } as ViewStyle}>
        <TextInput
            placeholder={placeholder}
            value={value}
            // @ts-ignore - React Native Web event handling
            onChange={(e: any) => onChange(e.target.value)}
            style={localStyles.searchInput}
        />
    </View>
);

const localStyles = StyleSheet.create({

    searchInput: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: vars.surface,
        backgroundColor: vars.box,
        color: vars.text,
        fontSize: 20,
        padding: 10,
    },
});

export default SearchBar;