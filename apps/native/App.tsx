/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState } from 'react';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/global.css';
import { TestButton } from './src/TestButton';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container} className="flex-1 bg-gray-50 justify-center items-center p-4">
      <Text className="text-4xl font-bold text-gray-900 mb-2">UniWind POC</Text>
      <Text className="text-lg text-gray-600 mb-8">Native App with React Native</Text>

      <View className="bg-white rounded-xl p-8 mb-8 w-80">
        <Text className="text-6xl font-bold text-primary-600 mb-4 text-center">{count}</Text>
        <Text className="text-sm text-gray-500 mb-6 text-center">Tap the buttons to test</Text>

        <View className="gap-3">
          <TestButton variant="primary" onPress={() => setCount(count + 1)}>
            Increment
          </TestButton>
          <TestButton variant="secondary" onPress={() => setCount(count - 1)}>
            Decrement
          </TestButton>
          <TestButton variant="secondary" onPress={() => setCount(0)}>
            Reset
          </TestButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
