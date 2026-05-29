import { Button } from "../common"
import { Colors } from "../../../../../styles"
import { View } from "react-native"

export default function LinkButton({ style, children, ...props }) {
    return (
        <View style={[productItem, style]}>
            {children}
        </View>
    )
}

const productItem = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 18,
    paddingRight: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
    backgroundColor: Colors.white,
    display: 'flex',
    cursor: 'pointer'
}