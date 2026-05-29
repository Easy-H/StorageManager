import { Button } from "../common"
import { Colors } from "../../../../../styles"

export default function FilterButton({ style, isActive, children, ...props }) {
    return (
        <Button style={[filterTab, isActive && activeTab, style]} {...props}>
            {children}
        </Button>
    )
}

const filterTab = {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    fontSize: 11,
    color: '#666',
    textWrap: 'nowrap'
};

const activeTab = {
    backgroundColor: '#fff',
    borderColor: '#1890ff',
    color: '#1890ff',
    fontWeight: 'bold',
};