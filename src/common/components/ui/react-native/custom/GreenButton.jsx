import { Button } from "../common"
import { Colors } from "../../../../../styles"

export default function GreenButton({style, children, ...props}) {
    return (
        <Button
            style={{...greenButton, ...style}}
            {...props}>
            { children }
        </Button>
    )
}

const greenButton = {
    flex: 1,
    padding: 14,
    background: Colors.successGreen,
    borderRadius: 8,
    color: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  }