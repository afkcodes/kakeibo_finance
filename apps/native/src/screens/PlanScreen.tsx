/**
 * PlanScreen - Subscription Tracking (Coming Soon)
 *
 * Placeholder UI for subscription management feature.
 * Full implementation planned - see SUBSCRIPTION_TRACKING_FEATURE.md
 */

import { StatusBar, Text, View } from 'react-native';
import { SafeView } from '~/components/common';
import { Calendar, PieChart, Star } from '../components/common/Icon';
import { SquircleView } from '../components/ui/SquircleView';

export const PlanScreen = () => {
  return (
    <SafeView
      style={{ flex: 1, backgroundColor: '#09090b' }}
      applyTopInset
      applyBottomInset={false}
    >
      <StatusBar barStyle="light-content" />

      <View className="flex-1 justify-center items-center px-6">
        {/* Icon Circle */}
        <View className="w-24 h-24 bg-primary-500/10 rounded-full items-center justify-center mb-6">
          <Calendar width={40} height={40} color="#5b6ef5" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-surface-50 text-center mb-3">
          Subscription Tracking
        </Text>

        {/* Description */}
        <Text className="text-surface-400 text-center text-base mb-8 leading-6">
          Manage all your recurring payments in one place. Track costs, get reminders, and never
          miss a payment.
        </Text>

        {/* Feature Preview Cards */}
        <View className="w-full gap-3">
          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            <View className="flex-row items-center p-4 gap-3">
              <View className="w-10 h-10 bg-primary-500/10 rounded-full items-center justify-center">
                <PieChart width={20} height={20} color="#5b6ef5" />
              </View>
              <View className="flex-1">
                <Text className="text-surface-200 font-semibold text-sm">
                  Track All Subscriptions
                </Text>
                <Text className="text-surface-500 text-xs mt-0.5">Netflix, Spotify, and more</Text>
              </View>
            </View>
          </SquircleView>

          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            <View className="flex-row items-center p-4 gap-3">
              <View className="w-10 h-10 bg-primary-500/10 rounded-full items-center justify-center">
                <Calendar width={20} height={20} color="#5b6ef5" />
              </View>
              <View className="flex-1">
                <Text className="text-surface-200 font-semibold text-sm">Payment Reminders</Text>
                <Text className="text-surface-500 text-xs mt-0.5">Never miss a due date</Text>
              </View>
            </View>
          </SquircleView>

          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            <View className="flex-row items-center p-4 gap-3">
              <View className="w-10 h-10 bg-primary-500/10 rounded-full items-center justify-center">
                <Star width={20} height={20} color="#5b6ef5" />
              </View>
              <View className="flex-1">
                <Text className="text-surface-200 font-semibold text-sm">Cost Analytics</Text>
                <Text className="text-surface-500 text-xs mt-0.5">See monthly & yearly totals</Text>
              </View>
            </View>
          </SquircleView>
        </View>

        {/* Coming Soon Badge */}
        <View className="mt-8">
          <View className="bg-primary-500/20 px-4 py-2 rounded-full">
            <Text className="text-primary-400 text-xs font-semibold tracking-wide">
              COMING SOON
            </Text>
          </View>
        </View>
      </View>
    </SafeView>
  );
};
