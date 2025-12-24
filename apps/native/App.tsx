/**
 * Kakeibo v2 - Native App Entry Point
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/global.css';
import { MainNavigator } from './src/navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <MainNavigator />
    </GestureHandlerRootView>
  );
}

export default App;
