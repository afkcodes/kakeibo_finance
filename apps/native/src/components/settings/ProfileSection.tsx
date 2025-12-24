/**
 * ProfileSection - User profile and authentication
 */

import { Text, View } from 'react-native';
import { AppIcon, Cloud, CloudOff } from '../common/Icon';
import { Button } from '../ui/Button';
import { SquircleView } from '../ui/SquircleView';

interface ProfileSectionProps {
  isGuest: boolean;
  userName: string;
  userEmail?: string;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const ProfileSection = ({
  isGuest,
  userName,
  userEmail,
  onSignIn,
  onSignOut,
}: ProfileSectionProps) => {
  return (
    <SquircleView
      backgroundColor="#141416"
      borderRadius={12}
      borderWidth={1}
      borderColor="#27272a"
      style={{ padding: 20 }}
    >
      <View className="flex-row items-center" style={{ gap: 16 }}>
        {/* Avatar */}
        <SquircleView
          backgroundColor={isGuest ? '#27272a' : '#5b6ef533'}
          borderRadius={12}
          style={{
            width: 64,
            height: 64,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppIcon width={32} height={32} color={isGuest ? '#71717a' : '#818cf8'} />
        </SquircleView>

        {/* User Info */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-surface-50">{userName}</Text>
          <View className="flex-row items-center mt-1" style={{ gap: 8 }}>
            {isGuest ? (
              <>
                <CloudOff width={14} height={14} color="#71717a" />
                <Text className="text-sm text-surface-400">Data saved on this device</Text>
              </>
            ) : (
              <>
                <Cloud width={14} height={14} color="#818cf8" />
                <Text className="text-sm text-surface-400">{userEmail}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Auth Action */}
      <View className="mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: '#27272a' }}>
        {isGuest ? (
          <Button variant="primary" onPress={onSignIn}>
            <Text className="text-white font-medium">Sign In with Google</Text>
          </Button>
        ) : (
          <Button variant="outline" onPress={onSignOut}>
            <Text className="text-surface-200 font-medium">Sign Out</Text>
          </Button>
        )}
      </View>
    </SquircleView>
  );
};
