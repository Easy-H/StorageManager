import React from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { Button } from "../common";
import vars from "../../vars";

interface PrimaryButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle | TextStyle>;
    children: React.ReactNode;
}

export default function PrimaryButton({ style, children, ...props }: PrimaryButtonProps) {
    return (
        <Button
            style={[primaryButtonStyle, , { backgroundColor: vars.primary, color: vars.buttonText }, style]}
            {...props}>
            { children }
        </Button>
    )
}

const primaryButtonStyle: ViewStyle & TextStyle = {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
};