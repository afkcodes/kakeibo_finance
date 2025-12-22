/**
 * @fileoverview Network and Offline Detection Hook
 * @module @kakeibo/web/hooks
 *
 * Provides network status and offline detection functionality
 */

import { useEffect, useState } from 'react';
import { toastHelpers } from '../utils/toast';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
}

/**
 * Hook to detect network status and offline state
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      setStatus((prev) => ({ ...prev, isOnline }));

      if (isOnline) {
        toastHelpers.success('Back online', 'Your connection has been restored');
      } else {
        toastHelpers.error('You are offline', 'Some features may be unavailable');
      }
    };

    const checkConnectionSpeed = () => {
      // Check if connection API is available
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        const isSlow = conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g';
        setStatus((prev) => ({ ...prev, isSlowConnection: isSlow }));

        if (isSlow && status.isOnline) {
          toastHelpers.warning('Slow connection', 'You may experience delays');
        }
      }
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Listen for connection changes
    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', checkConnectionSpeed);
    }

    // Initial check
    checkConnectionSpeed();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if ('connection' in navigator) {
        (navigator as any).connection?.removeEventListener('change', checkConnectionSpeed);
      }
    };
  }, [status.isOnline]);

  return status;
};

/**
 * Offline Banner Component
 */
export const OfflineBanner = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning-500 text-white px-4 py-2 text-center text-sm font-medium">
      <span className="inline-flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        You're offline - Changes will sync when you reconnect
      </span>
    </div>
  );
};
