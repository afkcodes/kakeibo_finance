/**
 * SettingsList - Reusable components for settings UI
 */

import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from '../common/Icon';

// Navigation Button (goes to another screen)
export interface MenuButtonProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onPress: () => void;
  showBorder?: boolean;
}

export const MenuButton = ({
  icon,
  iconBg,
  title,
  description,
  onPress,
  showBorder,
}: MenuButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className="flex-row items-center px-5 py-4"
          style={{
            gap: 12,
            backgroundColor: pressed ? '#18181b' : 'transparent',
            borderBottomWidth: showBorder ? 1 : 0,
            borderBottomColor: '#27272a',
          }}
        >
          <View
            className="items-center justify-center"
            style={{
              width: 44,
              height: 44,
              backgroundColor: iconBg,
              borderRadius: 10,
            }}
          >
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-surface-50">{title}</Text>
            <Text className="text-sm text-surface-400 mt-0.5">{description}</Text>
          </View>
          <ChevronRight width={20} height={20} color="#52525b" />
        </View>
      )}
    </Pressable>
  );
};

// Setting Row (shows current value, tappable to change)
export interface SettingRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  onPress: () => void;
  showBorder?: boolean;
}

export const SettingRow = ({
  icon,
  iconBg,
  label,
  value,
  onPress,
  showBorder,
}: SettingRowProps) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className="flex-row items-center px-5 py-4"
          style={{
            gap: 12,
            backgroundColor: pressed ? '#18181b' : 'transparent',
            borderBottomWidth: showBorder ? 1 : 0,
            borderBottomColor: '#27272a',
          }}
        >
          <View
            className="items-center justify-center"
            style={{
              width: 40,
              height: 40,
              backgroundColor: iconBg,
              borderRadius: 10,
            }}
          >
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-sm text-surface-400">{label}</Text>
            <Text className="text-base font-semibold text-surface-50 mt-0.5">{value}</Text>
          </View>
          <ChevronRight width={20} height={20} color="#52525b" />
        </View>
      )}
    </Pressable>
  );
};

// Action Button (performs immediate action)
export interface ActionButtonProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  onPress: () => void;
  showBorder?: boolean;
  destructive?: boolean;
}

export const ActionButton = ({
  icon,
  iconBg,
  title,
  description,
  onPress,
  showBorder,
  destructive,
}: ActionButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          className="flex-row items-center px-5 py-4"
          style={{
            gap: 12,
            backgroundColor: pressed ? '#18181b' : 'transparent',
            borderBottomWidth: showBorder ? 1 : 0,
            borderBottomColor: '#27272a',
          }}
        >
          <View
            className="items-center justify-center"
            style={{
              width: 40,
              height: 40,
              backgroundColor: iconBg,
              borderRadius: 10,
            }}
          >
            {icon}
          </View>
          <View className="flex-1">
            <Text
              className={`text-base font-semibold ${destructive ? 'text-red-500' : 'text-surface-50'}`}
            >
              {title}
            </Text>
            <Text className="text-sm text-surface-400 mt-0.5">{description}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

// Toggle Row (inline on/off switch)
export interface ToggleRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  showBorder?: boolean;
}

export const ToggleRow = ({
  icon,
  iconBg,
  label,
  description,
  value,
  onToggle,
  disabled,
  showBorder,
}: ToggleRowProps) => {
  return (
    <Pressable onPress={disabled ? undefined : onToggle} disabled={disabled}>
      {({ pressed }) => (
        <View
          className="flex-row items-center px-5 py-4"
          style={{
            gap: 12,
            backgroundColor: pressed && !disabled ? '#18181b' : 'transparent',
            borderBottomWidth: showBorder ? 1 : 0,
            borderBottomColor: '#27272a',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <View
            className="items-center justify-center"
            style={{
              width: 40,
              height: 40,
              backgroundColor: iconBg,
              borderRadius: 10,
            }}
          >
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-surface-50">{label}</Text>
            <Text className="text-sm text-surface-400 mt-0.5">{description}</Text>
          </View>
          {/* Toggle Switch Indicator */}
          <View
            className="items-center justify-center"
            style={{
              width: 44,
              height: 26,
              backgroundColor: value ? '#5b6ef5' : '#3f3f46',
              borderRadius: 13,
              padding: 2,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                backgroundColor: '#ffffff',
                borderRadius: 11,
                alignSelf: value ? 'flex-end' : 'flex-start',
              }}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
};
