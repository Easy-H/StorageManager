import React from 'react';
import { Button } from "../common"; // Assuming this Button component correctly handles styles for its children
import { Colors } from "../../../../../styles";
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';

// Define props for FilterButton
// Assuming the 'Button' from "../common" extends TouchableOpacityProps or similar
// and can accept both ViewStyle and TextStyle properties for its container and text children.
interface FilterButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle | TextStyle>; // Allow both View and Text styles if Button handles them
    isActive: boolean;
    children: React.ReactNode;
    numberOfLines?: number;
    // onPress is already part of TouchableOpacityProps
}

export default function FilterButton({ style, isActive, children, numberOfLines = 1, ...props }: FilterButtonProps) {
    return (
        <Button 
            style={[filterTab, isActive && activeTab, style]} 
            numberOfLines={numberOfLines}
            {...props}
        >
            {children}
        </Button>
    )
}

// Type the style objects. Combining ViewStyle and TextStyle to match original JS behavior
// where text-related styles are applied directly to a component that is likely a View/TouchableOpacity.
const filterTab: ViewStyle & TextStyle= {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8, // Changed from '8px' to 8 for React Native compatibility
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    fontSize: 11,
    color: '#666'
};

const activeTab: ViewStyle & TextStyle = {
    backgroundColor: '#fff',
    borderColor: Colors.primary,
    color: Colors.primary,
    fontWeight: 'bold',
};