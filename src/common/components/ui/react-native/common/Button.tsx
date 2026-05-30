import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle | TextStyle>;
    children: React.ReactNode;
    numberOfLines?: number;
}

export default function Button({ style, children, numberOfLines, ...props }: ButtonProps) {
    const flatStyle = (StyleSheet.flatten(style) || {}) as any;
    
    return (
        <TouchableOpacity 
            style={[buttonStyle, style as StyleProp<ViewStyle>]}
            { ...props }>
            <Text
                numberOfLines={numberOfLines}
                style={{
                    color: flatStyle.color,
                    fontSize: flatStyle.fontSize,
                    fontWeight: flatStyle.fontWeight,
                    textDecorationLine: flatStyle.textDecorationLine || flatStyle.textDecoration,
                    textAlign: flatStyle.textAlign
                } as TextStyle}
            >
                { children }
            </Text>
        </TouchableOpacity>
    );
}

const buttonStyle: ViewStyle = {
    padding: 14,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center'
}