import React from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { Button } from "../common";
import { Colors } from "../../../../../styles";
import vars from '../../vars';

interface SecondaryButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle | TextStyle>;
    children: React.ReactNode;
}

export default function SecondaryButton({ style, children, ...props }: SecondaryButtonProps) {
    return (
        <Button
            style={[secondaryButtonStyle, { backgroundColor: vars.secondary, color: vars.buttonText }, style]}
            {...props}>
            { children }
        </Button>
    )
}

const secondaryButtonStyle: ViewStyle & TextStyle = {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
};