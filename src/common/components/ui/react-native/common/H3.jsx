import { Text } from "react-native-web";

export default function H3({style, children}) {
    return (
        <Text style={{...h3style, ...style}}>
            {children}
        </Text>
    )
}

const h3style = {
    fontSize: 16,
    fontWeight: 'bold',

}