/**
 * MoreScreen - Settings and Tools
 *
 * Modular, maintainable settings screen following mobile.md principles:
 * - Highly modular (extracted reusable components)
 * - DRY (no repeated UI patterns)
 * - Separation of concerns (UI components vs screen logic)
 * - <200 lines per file
 */

import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeView } from '~/components/common';
import {
  Bell,
  Calendar,
  CalendarDays,
  Category,
  Download,
  FileText,
  Globe,
  Heart,
  Help,
  Info,
  PieChart,
  Share,
  Tag,
  Target,
  Trash,
  Upload,
  Wallet,
} from '../components/common/Icon';
import { NetWorthCard } from '../components/settings/NetWorthCard';
import { ProfileSection } from '../components/settings/ProfileSection';
import { ProMembershipCard } from '../components/settings/ProMembershipCard';
import {
  ActionButton,
  MenuButton,
  SettingRow,
  ToggleRow,
} from '../components/settings/SettingsList';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { SquircleView } from '../components/ui/SquircleView';

export const MoreScreen = () => {
  // TODO: Get from auth context & store
  const isGuest = true;
  const userName = 'Guest User';
  const userEmail = 'user@example.com';
  const netWorth = 19170.5;
  const accountsCount = 3;
  const theme = 'dark' as const;
  const currency = 'USD';
  const financialMonthStart = 1;
  const dateFormat = 'MM/DD/YYYY';
  const notificationsEnabled = true;
  const budgetAlerts = true;
  const goalReminders = false;

  // Event handlers
  const handleSignIn = () => console.log('Sign in');
  const handleSignOut = () => console.log('Sign out');
  const handleThemeChange = (newTheme: 'light' | 'dark') => console.log('Set theme:', newTheme);

  return (
    <SafeView collapsable={false} applyTopInset applyBottomInset={false}>
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1" contentInsetAdjustmentBehavior="automatic" collapsable={false}>
        {/* Page Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-xl font-semibold text-surface-50">More</Text>
          <Text className="text-sm text-surface-400 mt-0.5">Account, settings & tools</Text>
        </View>

        {/* Pro Membership Section */}
        <View className="px-5 mb-6">
          <ProMembershipCard onUpgrade={() => console.log('Upgrade to Pro')} />
        </View>

        {/* Net Worth Card */}
        <View className="px-5 mb-6">
          <NetWorthCard netWorth={netWorth} accountsCount={accountsCount} monthlyChange="+$2.4K" />
        </View>

        {/* Profile/Auth Section */}
        <View className="px-5 mb-6">
          <ProfileSection
            isGuest={isGuest}
            userName={userName}
            userEmail={userEmail}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
        </View>

        {/* Quick Access Section */}
        <View className="px-5 mb-6">
          <Text className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3 px-1">
            Quick Access
          </Text>
          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            <MenuButton
              icon={<Wallet width={22} height={22} color="#3b82f6" />}
              iconBg="#3b82f633"
              title="Accounts"
              description="View and manage accounts"
              onPress={() => console.log('Navigate to Accounts')}
              showBorder
            />

            <MenuButton
              icon={<Category width={22} height={22} color="#10b981" />}
              iconBg="#10b98133"
              title="Categories"
              description="Manage spending categories"
              onPress={() => console.log('Navigate to Categories')}
              showBorder
            />

            <MenuButton
              icon={<Tag width={22} height={22} color="#f59e0b" />}
              iconBg="#f59e0b33"
              title="Tags"
              description="Organize with custom tags"
              onPress={() => console.log('Navigate to Tags')}
              showBorder
            />

            <MenuButton
              icon={<PieChart width={22} height={22} color="#8b5cf6" />}
              iconBg="#8b5cf633"
              title="Budgets"
              description="Set and track spending limits"
              onPress={() => console.log('Navigate to Budgets')}
              showBorder
            />

            <MenuButton
              icon={<Target width={22} height={22} color="#ec4899" />}
              iconBg="#ec489933"
              title="Goals"
              description="Track savings and debt goals"
              onPress={() => console.log('Navigate to Goals')}
            />
          </SquircleView>
        </View>

        {/* Appearance Section */}
        <View className="px-5 mb-6">
          <Text className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3 px-1">
            Appearance
          </Text>
          <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
        </View>

        {/* Preferences Section */}
        <View className="px-5 mb-6">
          <Text className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3 px-1">
            Preferences
          </Text>
          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            {/* Currency */}
            <SettingRow
              icon={<Globe width={20} height={20} color="#3b82f6" />}
              iconBg="#3b82f633"
              label="Currency"
              value={currency}
              onPress={() => console.log('Select currency')}
              showBorder
            />

            {/* Financial Month Start */}
            <SettingRow
              icon={<CalendarDays width={20} height={20} color="#10b981" />}
              iconBg="#10b98133"
              label="Financial Month Start"
              value={`Day ${financialMonthStart}`}
              onPress={() => console.log('Select start day')}
              showBorder
            />

            {/* Date Format */}
            <SettingRow
              icon={<Calendar width={20} height={20} color="#f59e0b" />}
              iconBg="#f59e0b33"
              label="Date Format"
              value={dateFormat}
              onPress={() => console.log('Select date format')}
            />
          </SquircleView>
        </View>

        {/* Notifications Section */}
        <View className="px-5 mb-6">
          <Text className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3 px-1">
            Notifications
          </Text>
          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            <ToggleRow
              icon={<Bell width={20} height={20} color="#8b5cf6" />}
              iconBg="#8b5cf633"
              label="Enable Notifications"
              description="Get notified about your finances"
              value={notificationsEnabled}
              onToggle={() => console.log('Toggle notifications')}
              showBorder
            />

            <ToggleRow
              icon={<Bell width={20} height={20} color="#ec4899" />}
              iconBg="#ec489933"
              label="Budget Alerts"
              description="Get alerts when close to limits"
              value={budgetAlerts}
              onToggle={() => console.log('Toggle budget alerts')}
              disabled={!notificationsEnabled}
              showBorder
            />

            <ToggleRow
              icon={<Bell width={20} height={20} color="#f59e0b" />}
              iconBg="#f59e0b33"
              label="Goal Reminders"
              description="Get reminders to save toward goals"
              value={goalReminders}
              onToggle={() => console.log('Toggle goal reminders')}
              disabled={!notificationsEnabled}
            />
          </SquircleView>
        </View>

        {/* Data Management Section */}
        <View className="px-5 mb-6">
          <Text className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3 px-1">
            Data Management
          </Text>
          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            <ActionButton
              icon={<Download width={20} height={20} color="#34d399" />}
              iconBg="#10b98133"
              title="Export Data"
              description="Save a backup of your data"
              onPress={() => console.log('Export data')}
              showBorder
            />

            <ActionButton
              icon={<Upload width={20} height={20} color="#3b82f6" />}
              iconBg="#3b82f633"
              title="Import Data"
              description="Restore data from backup"
              onPress={() => console.log('Import data')}
              showBorder
            />

            <ActionButton
              icon={<Trash width={20} height={20} color="#ef4444" />}
              iconBg="#ef444433"
              title="Delete All Data"
              description="Clear all data from this device"
              onPress={() => console.log('Delete all data')}
              destructive
            />
          </SquircleView>
        </View>

        {/* About & Support Section */}
        <View className="px-5 mb-6">
          <Text className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3 px-1">
            About & Support
          </Text>
          <SquircleView
            backgroundColor="#141416"
            borderRadius={12}
            borderWidth={1}
            borderColor="#27272a"
          >
            <MenuButton
              icon={<Help width={22} height={22} color="#06b6d4" />}
              iconBg="#06b6d433"
              title="Help & Support"
              description="Get help or contact support"
              onPress={() => console.log('Help & support')}
              showBorder
            />

            <MenuButton
              icon={<Heart width={22} height={22} color="#f59e0b" />}
              iconBg="#f59e0b33"
              title="Rate App"
              description="Love Kakeibo? Leave us a review"
              onPress={() => console.log('Rate app')}
              showBorder
            />

            <MenuButton
              icon={<Share width={22} height={22} color="#10b981" />}
              iconBg="#10b98133"
              title="Share App"
              description="Share with friends and family"
              onPress={() => console.log('Share app')}
              showBorder
            />

            <MenuButton
              icon={<FileText width={22} height={22} color="#3b82f6" />}
              iconBg="#3b82f633"
              title="Privacy & Terms"
              description="How we handle your data"
              onPress={() => console.log('Privacy & terms')}
              showBorder
            />

            <MenuButton
              icon={<Info width={22} height={22} color="#8b5cf6" />}
              iconBg="#8b5cf633"
              title="About Kakeibo"
              description="App info and version details"
              onPress={() => console.log('About app')}
            />
          </SquircleView>
        </View>

        {/* App Info */}
        <View className="px-5 py-8 items-center">
          <Text className="text-sm text-surface-500">Kakeibo v2.0.0</Text>
          <Text className="text-xs text-surface-600 mt-1">
            Made with ❤️ for better financial health
          </Text>
        </View>
      </ScrollView>
    </SafeView>
  );
};
