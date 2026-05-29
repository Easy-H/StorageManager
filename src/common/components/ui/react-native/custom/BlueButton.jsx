import { Button } from "../common"
import { Colors } from "../../../../../styles"

export default function BlueButton({style, children, ...props}) {
    return (
        <Button
            style={{...blueButton, ...style}}
            {...props}>
            { children }
        </Button>
    )
}

const blueButton = {
    flex: 1,
    padding: 14,
    background: Colors.primary,
    borderRadius: 8,
    color: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.white,
    fontWeight: 'bold',
}