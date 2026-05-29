import { TouchableOpacity, Text } from "react-native-web";

export default function Button({ style, children, ...props}) {
    return (
        <TouchableOpacity 
            style={[buttonStyle, style]}
            { ...props }>
            <Text
                style={{
                    color: style?.color,
                    fontSize: style?.fontSize,
                    fontWeight: style?.fontWeight,
                    textDecoration: style?.textDecoration,
                    textAlign: style?.textAlign
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