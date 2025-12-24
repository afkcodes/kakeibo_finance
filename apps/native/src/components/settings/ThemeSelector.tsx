/**
 * ThemeSelector - Inline theme selection control
 */

import { Pressable, Text, View } from 'react-native';
import { Moon, Sun } from '../common/Icon';
import { SquircleView } from '../ui/SquircleView';

interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
  ];

  return (
    <SquircleView
      backgroundColor="#141416"
      borderRadius={12}
      borderWidth={1}
      borderColor="#27272a"
      style={{ padding: 20 }}
    >
      <View className="flex-row items-center mb-4" style={{ gap: 12 }}>
        <View
          className="items-center justify-center"
          style={{ width: 36, height: 36, backgroundColor: '#8b5cf633', borderRadius: 10 }}
        >
          <Moon width={18} height={18} color="#a78bfa" />
        </View>
        <Text className="text-base font-semibold text-surface-50">Theme</Text>
      </View>

      <View className="flex-row" style={{ gap: 12 }}>
        {themeOptions.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          const isSelected = currentTheme === themeOption.value;

          return (
            <Pressable
              key={themeOption.value}
              onPress={() => onThemeChange(themeOption.value)}
              style={{ flex: 1 }}
            >
              <SquircleView
                backgroundColor={isSelected ? '#5b6ef533' : '#1c1c1e'}
                borderRadius={12}
                borderWidth={2}
                borderColor={isSelected ? '#5b6ef5' : 'transparent'}
                style={{ padding: 16, alignItems: 'center' }}
              >
                <ThemeIcon width={24} height={24} color={isSelected ? '#818cf8' : '#71717a'} />
                <Text
                  className={`text-sm font-medium mt-2 ${isSelected ? 'text-primary-400' : 'text-surface-400'}`}
                >
                  {themeOption.label}
                </Text>
              </SquircleView>
            </Pressable>
          );
        })}
      </View>
    </SquircleView>
  );
};
