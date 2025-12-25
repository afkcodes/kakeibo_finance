import { Text, View } from 'react-native';
import { Tick } from '../common/Icon';
import { SquircleView } from '../ui/SquircleView';

interface ProMembershipCardProps {
  onUpgrade?: () => void;
}

export const ProMembershipCard = ({ onUpgrade }: ProMembershipCardProps) => {
  return (
    <SquircleView
      backgroundColor="#141416"
      borderRadius={16}
      borderWidth={1}
      borderColor="#5b6ef520"
      style={{ overflow: 'hidden' }}
    >
      {/* Gradient Overlay Background */}
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
        <View
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: '#5b6ef515',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#8b5cf610',
          }}
        />
      </View>

      <View className="p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-surface-50 text-xl font-bold">Kakeibo</Text>
              <View className="bg-primary-500 rounded-full px-2.5 py-1">
                <Text className="text-white text-xs font-bold tracking-wide">PRO</Text>
              </View>
            </View>
            <Text className="text-surface-400 text-sm">Unlock all premium features</Text>
          </View>
        </View>

        {/* Features */}
        <View className="gap-3 mb-5">
          <View className="flex-row items-center gap-3">
            <View className="w-6 h-6 bg-primary-500/20 rounded-full items-center justify-center">
              <Tick width={14} height={14} color="#5b6ef5" />
            </View>
            <Text className="text-surface-200 text-sm flex-1">Cloud sync across all devices</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="w-6 h-6 bg-primary-500/20 rounded-full items-center justify-center">
              <Tick width={14} height={14} color="#5b6ef5" />
            </View>
            <Text className="text-surface-200 text-sm flex-1">Advanced analytics & insights</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="w-6 h-6 bg-primary-500/20 rounded-full items-center justify-center">
              <Tick width={14} height={14} color="#5b6ef5" />
            </View>
            <Text className="text-surface-200 text-sm flex-1">Unlimited budgets & goals</Text>
          </View>
        </View>

        {/* CTA Button */}
        <SquircleView backgroundColor="#5b6ef5" borderRadius={12} style={{ overflow: 'hidden' }}>
          <View className="py-3.5 items-center">
            <Text className="text-white text-sm font-semibold">Upgrade to Pro</Text>
          </View>
        </SquircleView>
      </View>
    </SquircleView>
  );
};
