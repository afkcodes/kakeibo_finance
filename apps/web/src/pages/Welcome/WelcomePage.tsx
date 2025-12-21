import { useNavigate } from '@tanstack/react-router';
import { Cloud, CloudOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

/**
 * WelcomePage Component
 *
 * Landing screen for new users. Provides two options:
 * 1. "Start Tracking" - Continue as guest (local-only storage)
 * 2. "Sign in with Google" - Enable cloud backup & sync
 *
 * Design: Fixed viewport, non-scrollable, mobile-first
 */
export const WelcomePage = () => {
  const navigate = useNavigate();
  const { signIn, isLoading: authLoading } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle Start Tracking (Guest Mode)
   */
  const handleStartTracking = () => {
    setIsStarting(true);
    setError(null);

    // Mark that user has seen welcome page
    localStorage.setItem('hasSeenWelcome', 'true');

    // Navigate to dashboard
    setTimeout(() => {
      navigate({ to: '/' });
    }, 300);
  };

  /**
   * Handle Google Sign In
   */
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      // Mark that user has seen welcome page
      localStorage.setItem('hasSeenWelcome', 'true');

      // Initiate OAuth flow
      await signIn({
        provider: 'google',
        redirectTo: window.location.origin,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setIsSigningIn(false);
    }
  };

  // Show loading state
  if (authLoading && !isStarting && !isSigningIn) {
    return (
      <div className="h-dvh bg-surface-950 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse">
            <img src="/icons/icon.svg" alt="Kakeibo" className="w-16 h-16 rounded-2xl" />
          </div>
          <p className="text-surface-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-surface-950 flex flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-primary-500/8 via-transparent to-transparent pointer-events-none" />

      {/* Content - Fixed layout */}
      <div className="relative flex-1 flex flex-col px-6 py-4 max-w-md mx-auto w-full">
        {/* Top Section - Branding */}
        <header className="flex flex-col items-center pt-4 pb-2">
          {/* App Icon */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-500/20 mb-4">
            <img src="/icons/icon.svg" alt="Kakeibo" className="w-20 h-20 rounded-3xl" />
          </div>

          {/* App Name */}
          <h1 className="text-3xl font-bold text-surface-50 mb-1">Kakeibo</h1>

          {/* Tagline */}
          <p className="text-surface-400 text-center text-[15px]">Personal finance, done right</p>
        </header>

        {/* Spacer - keeps CTAs at bottom */}
        <div className="flex-1" />

        {/* Bottom Section - CTAs */}
        <footer className="space-y-3 pb-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 mb-2">
              <p className="text-danger-400 text-[13px] text-center">{error}</p>
            </div>
          )}

          {/* Primary CTA - Start without account */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartTracking}
            disabled={isStarting || isSigningIn}
            className="w-full h-14 text-[16px] font-semibold rounded-2xl"
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Setting up...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CloudOff className="w-5 h-5" />
                Start Tracking
              </span>
            )}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-surface-800" />
            <span className="text-surface-500 text-[13px]">or</span>
            <div className="flex-1 h-px bg-surface-800" />
          </div>

          {/* Secondary CTA - Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isStarting || isSigningIn}
            className={`w-full h-14 rounded-2xl border border-surface-700 bg-surface-900/80 flex items-center justify-center gap-3 text-surface-100 text-[15px] font-medium transition-all duration-200 hover:bg-surface-800 hover:border-surface-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}
          >
            {isSigningIn ? (
              <>
                <LoadingSpinner />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
                <Cloud className="w-4 h-4 text-primary-400" />
              </>
            )}
          </button>

          {/* Privacy & Cloud sync note */}
          <div className="flex items-center justify-center gap-1.5 pt-2 text-surface-500 text-[12px]">
            <Lock className="w-3.5 h-3.5" />
            <span>Private & secure • Sync across devices</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

/**
 * Google "G" logo icon
 */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

/**
 * Simple loading spinner
 */
const LoadingSpinner = () => (
  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
  </svg>
);

export default WelcomePage;
