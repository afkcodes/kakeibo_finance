import { Text, View } from 'react-native';

export const GoalsScreen = () => {
  return (
    <View className="bg-surface-950 flex-1 justify-center items-center">
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>Goals</Text>
      <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>Coming soon...</Text>
    </View>
  );
};
