import { currencyOptions, dateFormatOptions } from '@kakeibo/core';
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  Cloud,
  CloudOff,
  DollarSign,
  Download,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sun,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Button, Modal, Select } from '../../components/ui';
import { useAuth } from '../../hooks';
import { useAppStore } from '../../store/appStore';
import { toastHelpers } from '../../utils';

export const SettingsPage = () => {
  const { theme, setTheme, settings, updateSettings } = useAppStore();
  const { user, isAuthenticated, isGuest, signIn, signOut } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const formatDay = (d: string | number | undefined) => {
    const n = Math.min(Math.max(1, Number(d ?? 28)), 28);
    const s = String(n);
    const j = n % 10,
      k = n % 100;
    let suffix = 'th';
    if (j === 1 && k !== 11) suffix = 'st';
    else if (j === 2 && k !== 12) suffix = 'nd';
    else if (j === 3 && k !== 13) suffix = 'rd';
    return s + suffix;
  };

  const handleDeleteAllData = async () => {
    try {
      // TODO: Implement clear database functionality
      console.log('Delete all data - not implemented');
      setShowDeleteModal(false);
      toastHelpers.warning(
        'Feature coming soon',
        'Delete all data functionality will be implemented'
      );
    } catch (error) {
      toastHelpers.error(
        'Failed to delete data',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const handleExportData = () => {
    try {
      // TODO: Implement export functionality
      console.log('Export data - not implemented');
      toastHelpers.warning('Feature coming soon', 'Export data functionality will be implemented');
    } catch (error) {
      toastHelpers.error(
        'Failed to export data',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const handleImportData = () => {
    try {
      // TODO: Implement import functionality
      console.log('Import data - not implemented');
      toastHelpers.warning('Feature coming soon', 'Import data functionality will be implemented');
    } catch (error) {
      toastHelpers.error(
        'Failed to import data',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-semibold text-surface-50">Settings</h1>
          <p className="text-sm text-surface-400 mt-0.5">Customize your app preferences</p>
        </div>

        {/* Profile/Auth Section */}
        <div className="bg-surface-800/60 border border-surface-700/50 rounded-xl squircle overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl squircle flex items-center justify-center ${
                  isAuthenticated ? 'bg-primary-500/20' : 'bg-surface-700/50'
                }`}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.displayName || 'User'}
                    className="w-full h-full rounded-xl object-cover"
                    onError={(e) => {
                      // Hide broken image and show fallback User icon
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const icon = document.createElement('div');
                        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${isAuthenticated ? '#818cf8' : '#9ca3af'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                        parent.appendChild(icon);
                      }
                    }}
                  />
                ) : (
                  <User
                    className={`w-8 h-8 ${isAuthenticated ? 'text-primary-400' : 'text-surface-400'}`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-surface-50 truncate">
                  {user?.displayName || 'Guest User'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {isGuest ? (
                    <>
                      <CloudOff className="w-3.5 h-3.5 text-surface-500" />
                      <p className="text-sm text-surface-400">Local storage only</p>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-3.5 h-3.5 text-primary-400" />
                      <p className="text-sm text-surface-400 truncate">{user?.email}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="mt-4 pt-4 border-t border-surface-700/50">
              {isGuest ? (
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={isSigningIn}
                  onClick={async () => {
                    try {
                      setIsSigningIn(true);
                      await signIn({
                        provider: 'google',
                        redirectTo: `${window.location.origin}/settings`,
                      });
                    } catch (error) {
                      toastHelpers.error(
                        'Sign in failed',
                        error instanceof Error ? error.message : 'Failed to sign in'
                      );
                      setIsSigningIn(false);
                    }
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {isSigningIn ? 'Signing in...' : 'Sign In with Google'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled={isSigningOut}
                  onClick={async () => {
                    try {
                      setIsSigningOut(true);
                      await signOut({ keepLocalData: true });
                      toastHelpers.success('Signed out', 'You have been signed out');
                    } catch (error) {
                      toastHelpers.error(
                        'Sign out failed',
                        error instanceof Error ? error.message : 'Failed to sign out'
                      );
                    } finally {
                      setIsSigningOut(false);
                    }
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isSigningOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-surface-800/60 border border-surface-700/50 rounded-xl squircle overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="font-medium text-surface-50">Appearance</h2>
            </div>
          </div>
          <div className="p-5">
            <label className="block text-sm text-surface-400 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;

                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value as 'light' | 'dark' | 'system');
                      toastHelpers.success('Theme updated', `Changed to ${option.label} mode`);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-surface-700 hover:border-surface-600 bg-surface-800/50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-primary-400' : 'text-surface-400'}`}
                    />
                    <p
                      className={`text-sm font-medium ${isSelected ? 'text-primary-400' : 'text-surface-400'}`}
                    >
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-surface-800/60 border border-surface-700/50 rounded-xl squircle overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="font-medium text-surface-50">Preferences</h2>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="px-5 py-4 border-b border-surface-700/50">
            <p className="text-sm text-surface-400 mb-3">Currency</p>
            <Select
              options={currencyOptions}
              value={settings.currency}
              onValueChange={(value) => {
                updateSettings({ currency: value });
                const currencyLabel =
                  currencyOptions.find((opt) => opt.value === value)?.label || value;
                toastHelpers.success('Currency updated', `Changed to ${currencyLabel}`);
              }}
            />
          </div>

          {/* Date Format Selection */}
          <div className="px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-surface-400 mb-2 sm:mb-0">Date Format</p>
              <div className="flex flex-wrap items-center gap-3">
                {dateFormatOptions.map((option) => {
                  const isSelected = settings.dateFormat === option.value;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => {
                        updateSettings({ dateFormat: option.value });
                        toastHelpers.success('Date format updated', `Changed to ${option.label}`);
                      }}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-150 ${
                        isSelected
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-surface-700/40 text-surface-300 hover:bg-surface-700/60'
                      }`}
                      style={{ minWidth: 120 }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Financial Month Start */}
          <button
            type="button"
            onClick={() => setShowMonthPicker(true)}
            className="w-full text-left px-5 py-4 border-t border-surface-700/50 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-400">Financial Month Start</p>
                <p className="text-xs text-surface-500">
                  Choose the day your financial month begins
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="py-1 px-3 bg-surface-700/40 rounded-full text-sm font-medium text-surface-50">
                  {formatDay(settings.financialMonthStart ?? 28)}
                </div>
                <ChevronRight className="w-4 h-4 text-surface-500" />
              </div>
            </div>
          </button>
        </div>

        {/* Notifications Section */}
        <div className="bg-surface-800/60 border border-surface-700/50 rounded-xl squircle overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning-500/20 rounded-lg">
                <Bell className="w-4 h-4 text-warning-400" />
              </div>
              <h2 className="font-medium text-surface-50">Notifications</h2>
            </div>
          </div>
          <div className="divide-y divide-surface-700/50">
            {[
              {
                key: 'budgetAlerts',
                label: 'Budget Alerts',
                description: "Get notified when you're close to budget limits",
              },
              {
                key: 'billReminders',
                label: 'Bill Reminders',
                description: 'Reminders for upcoming bills and payments',
              },
              {
                key: 'weeklyReports',
                label: 'Weekly Reports',
                description: 'Receive weekly spending summaries',
              },
              {
                key: 'unusualSpending',
                label: 'Unusual Spending',
                description: 'Alerts for unusual spending patterns',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-surface-100">{item.label}</p>
                  <p className="text-sm text-surface-400">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      settings.notifications[item.key as keyof typeof settings.notifications]
                    }
                    onChange={(e) => {
                      updateSettings({
                        notifications: {
                          ...settings.notifications,
                          [item.key]: e.target.checked,
                        },
                      });
                      toastHelpers.success(
                        `${item.label} ${e.target.checked ? 'enabled' : 'disabled'}`,
                        e.target.checked
                          ? 'You will receive notifications'
                          : 'Notifications turned off'
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-surface-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 peer-checked:after:bg-white" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-surface-800/60 border border-surface-700/50 rounded-xl squircle overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-500/20 rounded-lg">
                <Shield className="w-4 h-4 text-success-400" />
              </div>
              <h2 className="font-medium text-surface-50">Data Management</h2>
            </div>
          </div>
          <div className="divide-y divide-surface-700/50">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-surface-400" />
                <div className="text-left">
                  <p className="font-medium text-surface-100">Export Data</p>
                  <p className="text-sm text-surface-400">Create encrypted backup of your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-500" />
            </button>

            <button
              type="button"
              onClick={handleImportData}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-surface-400" />
                <div className="text-left">
                  <p className="font-medium text-surface-100">Import Data</p>
                  <p className="text-sm text-surface-400">
                    Import from JSON or encrypted backup file
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-500" />
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-danger-500/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-danger-400" />
                <div className="text-left">
                  <p className="font-medium text-danger-400">Delete All Data</p>
                  <p className="text-sm text-surface-400">Permanently delete all your data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-surface-500" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-surface-500">Kakeibo v2.0.0</p>
          <p className="text-xs text-surface-600 mt-1">Made with ❤️ for better financial health</p>
        </div>
      </div>

      {/* Financial Month Picker Modal */}
      <Modal
        isOpen={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        title="Select Financial Month Start"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-400">Select a day between 1 and 28.</p>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1;
              const isSelected = settings.financialMonthStart === day;
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => {
                    updateSettings({ financialMonthStart: day });
                    setShowMonthPicker(false);
                    toastHelpers.success(
                      'Financial month updated',
                      `Month starts on ${formatDay(day)}`
                    );
                  }}
                  className={`py-2 px-2 rounded-md text-sm font-medium ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-800/40 text-surface-200 hover:bg-surface-800/60'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowMonthPicker(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete All Data"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-danger-500/20 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-danger-400" />
            </div>
            <div>
              <p className="text-surface-200">Are you sure you want to delete all your data?</p>
              <p className="text-sm text-surface-400 mt-2">
                This will permanently delete all your accounts, transactions, budgets, and settings.
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="danger" className="flex-1" onClick={handleDeleteAllData}>
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
