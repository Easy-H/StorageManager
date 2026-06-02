import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import vars from "../../vars";

interface H2Props {
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
}

export default function H2({ style, children }: H2Props) {
    return (
        <Text style={[h2Style, style]}>
            {children}
        </Text>
    );
}

const h2Style: TextStyle = {
    color: vars.text,
    fontSize: 24,
    fontWeight: 'bold',
};