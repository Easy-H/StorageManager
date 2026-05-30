import React from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { Button } from "../common";

interface LinkButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle | TextStyle>;
    children: React.ReactNode;
}

export default function LinkButton({ style, children, ...props }: LinkButtonProps) {
    return (
        <Button
            style={[closeButtonStyle, style]}
            {...props}>
            { children }
        </Button>
    )
}

const closeButtonStyle: ViewStyle & TextStyle = {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: '#888',
    textDecorationLine: 'underline',
    // @ts-ignore - react-native-web 특화 속성
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'center',
};