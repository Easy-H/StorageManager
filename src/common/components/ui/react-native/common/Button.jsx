import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({ style, children, ...props}) {
    const flatStyle = StyleSheet.flatten(style);
    
    return (
        <TouchableOpacity 
            style={[buttonStyle, style]}
            { ...props }>
            <Text
                style={{
                    color: flatStyle?.color,
                    fontSize: flatStyle?.fontSize,
                    fontWeight: flatStyle?.fontWeight,
                    textDecorationLine: flatStyle?.textDecorationLine || flatStyle?.textDecoration,
                    textAlign: flatStyle?.textAlign,
                    textWrap: flatStyle?.textWrap
                }}
            >
                { children }
            </Text>
        </TouchableOpacity>
    );
    
}

const buttonStyle = {
    padding: 14,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center'
}