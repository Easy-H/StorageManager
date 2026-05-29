import { View } from "react-native-web";

export default function Box({style, children}) {
    return (
        <View style={{...ViewStyle, ...style}}>
            {children}
        </View>
    )
}

const ViewStyle = {
    background: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#eeeeee'
};