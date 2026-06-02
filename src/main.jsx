import { createRoot } from 'react-dom/client'
import { StyleSheet, View, Platform } from 'react-native'
import App from './App.jsx'
import { vars } from './common/components/ui-brick';

export const localStyles = StyleSheet.create({
    appWrapper: {
        ...Platform.select({
            web: { height: '100vh' },
            default: { height: '100%' }
        }),
        backgroundColor: vars.background,
    }
});

createRoot(document.getElementById('root')).render(
    <View style={localStyles.appWrapper}>
        <App />
    </View>,
)