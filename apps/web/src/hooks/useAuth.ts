/**
 * Placeholder useAuth hook
 * This will be replaced with actual authentication implementation later
 */

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  signIn: (options: { provider: 'google'; redirectTo: string }) => Promise<void>;
  signOut: () => Promise<{ success: boolean; error?: { message: string } }>;
}

export const useAuth = (): AuthState => {
  // Placeholder guest user
  const guestUser: User = {
    id: 'guest',
    email: null,
    displayName: 'Guest User',
    photoURL: null,
  };

  return {
    user: guestUser,
    isAuthenticated: false,
    isGuest: true,
    isLoading: false,
    signIn: async () => {
      console.log('Sign in not implemented yet');
      throw new Error('Sign in not implemented');
    },
    signOut: async () => {
      console.log('Sign out not implemented yet');
      return { success: true };
    },
  };
};
