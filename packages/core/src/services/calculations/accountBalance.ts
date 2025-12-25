/**
 * @fileoverview Account balance calculation utilities
 * @module @kakeibo/core/services/calculations
 *
 * Pure calculation approach: Balance = initialBalance + sum of all transactions
 * Never update balance directly - always calculated from transaction history
 *
 * Platform: Platform-agnostic (core)
 */

import type { Transaction } from '../../types';

/**
 * Calculate account balance from initial balance and transactions
 *
 * Formula: balance = initialBalance + income - expenses + transfers(net) + adjustments
 *
 * @param initialBalance - Starting balance when account tracking began
 * @param transactions - All transactions for this account (chronological order preferred but not required)
 * @returns Calculated current balance
 *
 * @example
 * ```ts
 * const balance = calculateAccountBalance(1000, [
 *   { type: 'income', amount: 500, accountId: 'acc1' },
 *   { type: 'expense', amount: 200, accountId: 'acc1' },
 * ]);
 * // balance = 1000 + 500 - 200 = 1300
 * ```
 */
export function calculateAccountBalance(
  initialBalance: number,
  transactions: Transaction[]
): number {
  let balance = initialBalance;

  for (const tx of transactions) {
    switch (tx.type) {
      case 'income':
        balance += tx.amount;
        break;

      case 'expense':
        balance -= tx.amount;
        break;

      case 'transfer':
        // Transfer subtracts from source account
        balance -= tx.amount;
        break;

      case 'goal-contribution':
        // Contribution deducts from account
        balance -= tx.amount;
        break;

      case 'goal-withdrawal':
        // Withdrawal adds to account
        balance += tx.amount;
        break;

      case 'balance-adjustment':
        // Manual adjustment (can be positive or negative)
        // Note: Amount in transaction should already have correct sign
        balance += tx.amount;
        break;

      default:
        // Unknown transaction type - skip
        console.warn(`Unknown transaction type: ${(tx as Transaction).type}`);
    }
  }

  return balance;
}

/**
 * Calculate balance for transfer destination account
 *
 * Used when calculating balance for account that received a transfer
 *
 * @param initialBalance - Starting balance
 * @param incomingTransfers - Transfers where this account is the destination (toAccountId)
 * @param otherTransactions - All other transactions for this account
 * @returns Calculated current balance
 */
export function calculateAccountBalanceWithTransfers(
  initialBalance: number,
  incomingTransfers: Transaction[],
  otherTransactions: Transaction[]
): number {
  // Calculate from other transactions
  let balance = calculateAccountBalance(initialBalance, otherTransactions);

  // Add incoming transfers
  for (const transfer of incomingTransfers) {
    if (transfer.type === 'transfer') {
      balance += transfer.amount;
    }
  }

  return balance;
}

/**
 * Validate calculated balance against expected balance
 * Useful for debugging and data integrity checks
 *
 * @param expected - Expected balance (e.g., from cached value)
 * @param calculated - Calculated balance from transactions
 * @param tolerance - Acceptable difference (for floating point precision)
 * @returns Whether balances match within tolerance
 */
export function validateBalance(
  expected: number,
  calculated: number,
  tolerance = 0.01
): { isValid: boolean; difference: number } {
  const difference = Math.abs(expected - calculated);
  return {
    isValid: difference <= tolerance,
    difference,
  };
}
