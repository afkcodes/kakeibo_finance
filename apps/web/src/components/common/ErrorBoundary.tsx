/**
 * @fileoverview Global Error Boundary Component
 * @module @kakeibo/web/components/common
 *
 * Catches React errors anywhere in the component tree,
 * logs error information, and displays a fallback UI.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    // You can also log the error to an error reporting service here
    // Example: Sentry.captureException(error, { extra: errorInfo });

    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface-900 border border-surface-700 rounded-2xl p-6 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-danger-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-danger-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-semibold text-surface-50 mb-2">Something went wrong</h1>

            {/* Error Message */}
            <p className="text-surface-300 text-sm mb-6">
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </p>

            {/* Error Details (only in development) */}
            {import.meta.env.DEV && (
              <div className="mb-6 p-4 bg-surface-800 rounded-lg text-left">
                <p className="text-xs font-mono text-danger-400 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs font-mono text-surface-400">
                    <summary className="cursor-pointer hover:text-surface-300">Stack trace</summary>
                    <pre className="mt-2 overflow-auto max-h-48 text-[10px]">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={this.resetError}
                className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-3 bg-surface-700 hover:bg-surface-600 text-surface-100 rounded-xl font-medium transition-colors"
              >
                Reload Page
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-surface-500 mt-4">
              If the problem persists, try clearing your browser cache or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
