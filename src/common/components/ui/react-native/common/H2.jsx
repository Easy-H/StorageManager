import { Text } from "react-native-web";

export default function H2({style, children}) {
    return (
        <Text style={{...h2style, ...style}}>
            {children}
        </Text>
    )
}

const h2style = {
    fontSize: 24,
    fontWeight: 'bold',

}