import { NavigationContext } from 'navigation-react';
import { useContext } from 'react';
import { Text, View } from 'react-native';
import { AppIcon, Cloud, CloudOff, GoogleIcon, Lock } from '../components/common/Icon';
import { Button } from '../components/ui/Button';

export const WelcomeScreen = () => {
  const { stateNavigator } = useContext(NavigationContext);

  const handleGetStarted = () => {
    stateNavigator.navigate('tabs');
  };

  const handleSignIn = () => {
    stateNavigator.navigate('tabs');
  };

  return (
    <View className="flex-1 bg-surface-950">
      {/* <StatusBar barStyle="light-content" hidden /> */}

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        className="bg-linear-to-b from-primary-500/8 via-transparent to-transparent pointer-events-none"
      />

      <View className="flex-1 px-8 justify-between pb-12 pt-16">
        <View className="items-center">
          <AppIcon width={130} height={130} />
          <Text className="text-6xl font-bold text-surface-50 tracking-tight -mt-2 mb-3">
            Kakeibo
          </Text>
          <Text className="text-surface-400 text-base text-center px-4 leading-6">
            Personal finance, done right
          </Text>
        </View>

        <View className="flex-1" />

        <View style={{ gap: 12 }}>
          <Button variant="primary" size="lg" fullWidth onPress={handleGetStarted}>
            <CloudOff width={20} height={20} color="#ffffff" />
            <Text className="text-white text-base font-semibold ml-2">Start Tracking</Text>
          </Button>

          <View className="flex-row items-center py-1" style={{ gap: 12 }}>
            <View className="flex-1 h-px bg-surface-800" />
            <Text className="text-surface-500 text-xs">or</Text>
            <View className="flex-1 h-px bg-surface-800" />
          </View>

          <Button variant="outline" size="lg" fullWidth onPress={handleSignIn}>
            <GoogleIcon width={20} height={20} />
            <Text className="text-surface-100 text-base font-medium mx-2">
              Continue with Google
            </Text>
            <Cloud width={16} height={16} color="#5b6ef5" />
          </Button>

          <View className="flex-row items-center justify-center pt-2" style={{ gap: 6 }}>
            <Lock width={14} height={14} color="#71717a" />
            <Text className="text-surface-500 text-xs">Private & secure • Sync across devices</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
