import React from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { Button } from "../common";
import { Colors } from "../../../../../styles";
import vars from '../../vars';

interface GreenButtonProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle | TextStyle>;
    children: React.ReactNode;
}

export default function GreenButton({ style, children, ...props }: GreenButtonProps) {
    return (
        <Button
            style={[greenButtonStyle, style]}
            {...props}>
            { children }
        </Button>
    )
}

const greenButtonStyle: ViewStyle & TextStyle = {
    flex: 1,
    padding: 14,
    backgroundColor: vars.secondary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    color: vars.buttonText,
    fontWeight: 'bold',
};