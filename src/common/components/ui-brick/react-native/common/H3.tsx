import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import vars from "../../vars";

interface H3Props {
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
}

export default function H3({ style, children }: H3Props) {
    return (
        <Text style={[h3Style, { color: vars.text }, style]}>
            {children}
        </Text>
    );
}

const h3Style: TextStyle = {
    fontSize: 16,
    fontWeight: 'bold',
};