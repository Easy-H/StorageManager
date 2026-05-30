import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";

interface BoxProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export default function Box({ style, children }: BoxProps) {
    return (
        <View style={[boxStyle, style]}>
            {children}
        </View>
    )
}

const boxStyle: ViewStyle = {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#eeeeee',
    // @ts-ignore - Web 전용 그림자 속성 유지
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};