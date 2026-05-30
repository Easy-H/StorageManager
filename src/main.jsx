import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { View } from 'react-native-web'
import { styles } from './styles.js'

createRoot(document.getElementById('root')).render(
    <View style={styles.appWrapper}>
        <App />
    </View>,
)
