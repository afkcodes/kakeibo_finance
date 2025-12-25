/**
 * @fileoverview Account type definitions and utilities
 * @module @kakeibo/core/types
 *
 * Defines the Account entity used for tracking user financial accounts
 * including bank accounts, credit cards, cash, investments, and digital wallets.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Supported account types
 */
export type AccountType = 'bank' | 'credit' | 'cash' | 'investment' | 'wallet';

/**
 * Account entity representing a financial account
 *
 * Accounts are the containers for transactions. Users can have multiple
 * accounts and track balances across all of them.
 *
 * IMPORTANT: Balance is calculated from initialBalance + all transactions.
 * Never update balance directly - always create transactions.
 */
export interface Account {
  /** Unique identifier */
  id: string;

  /** Owner user ID */
  userId: string;

  /** User-defined account name (e.g., "Chase Checking", "AMEX Card") */
  name: string;

  /** Type of account */
  type: AccountType;

  /**
   * Initial balance when account was created/started being tracked
   * This is the starting point for balance calculations
   */
  initialBalance: number;

  /**
   * Current balance (calculated from initialBalance + all transactions)
   * This is computed on-the-fly, not stored/updated directly
   */
  balance: number;

  /** Currency code (e.g., "USD", "EUR", "INR") */
  currency: string;

  /** Color for UI display (hex format) */
  color: string;

  /** Icon name for UI display (from icon library) */
  icon: string;

  /** Whether account is active (inactive accounts don't show in main views) */
  isActive: boolean;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Human-readable labels for account types
 */
export const accountTypeLabels: Record<AccountType, string> = {
  bank: 'Bank Account',
  credit: 'Credit Card',
  cash: 'Cash',
  investment: 'Investment',
  wallet: 'Digital Wallet',
};

/**
 * Default icon mappings for account types
 */
export const accountTypeIcons: Record<AccountType, string> = {
  bank: 'landmark',
  credit: 'credit-card',
  cash: 'banknote',
  investment: 'trending-up',
  wallet: 'wallet',
};
