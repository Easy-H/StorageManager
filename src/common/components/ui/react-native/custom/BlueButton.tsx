import React from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { Button } from "../common";
import { Colors } from "../../../../../styles";

interface BlueButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle | TextStyle>;
    children: React.ReactNode;
}

export default function BlueButton({ style, children, ...props }: BlueButtonProps) {
    return (
        <Button
            style={[blueButtonStyle, style]}
            {...props}>
            { children }
        </Button>
    )
}

const blueButtonStyle: ViewStyle & TextStyle = {
    flex: 1,
    padding: 14,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.white,
    fontWeight: 'bold',
};