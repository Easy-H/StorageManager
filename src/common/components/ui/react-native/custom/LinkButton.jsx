import { Button } from "../common"
import { Colors } from "../../../../../styles"

export default function LinkButton({style, children, ...props}) {
    return (
        <Button
            style={{...closeButton, ...style}}
            {...props}>
            { children }
        </Button>
    )
}

const closeButton = {
    background: 'none',
    borderColor: 'none',
    color: '#888',
    textDecorationLine: 'underline',
    cursor: 'pointer',
    fontSize: 14,
    textAlign: 'center'
}