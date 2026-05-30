import React from 'react';
import { styles } from '../../styles';
import { View, TextInput, ViewStyle } from 'react-native';

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
            style={styles.searchInput}
        />
    </View>
);

export default SearchBar;