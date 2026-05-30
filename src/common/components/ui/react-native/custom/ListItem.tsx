import React from "react"
import { TouchableOpacity, ViewStyle, StyleProp, TouchableOpacityProps } from "react-native"
import { Colors } from "../../../../../styles"

interface ListItemProps extends TouchableOpacityProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export default function ListItem({ style, children, ...props }: ListItemProps) {
    return (
        <TouchableOpacity style={[listItemStyle, style]} {...props}>
            {children}
        </TouchableOpacity>
    )
}

const listItemStyle: ViewStyle = {
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
    // @ts-ignore - Web 전용 속성
    cursor: 'pointer'
}