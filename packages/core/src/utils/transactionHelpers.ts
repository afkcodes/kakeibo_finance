/**
 * @fileoverview Transaction utility functions
 * @module @kakeibo/core/utils
 */

import type { TransactionType } from '../types';

/**
 * Get the color for a transaction amount based on type
 */
export const getTransactionAmountColor = (type: TransactionType): string => {
  switch (type) {
    case 'expense':
      return '#f87171'; // danger-400
    case 'income':
      return '#4ade80'; // success-400
    case 'goal-contribution':
      return '#818cf8'; // primary-400
    case 'goal-withdrawal':
      return '#fbbf24'; // warning-400
    default:
      return '#f8fafc'; // surface-100
  }
};

/**
 * Get the prefix symbol for a transaction amount
 */
export const getTransactionAmountPrefix = (type: TransactionType): string => {
  switch (type) {
    case 'expense':
      return '−';
    case 'income':
      return '+';
    default:
      return '';
  }
};

/**
 * Check if transaction is goal-related
 */
export const isGoalTransaction = (type: TransactionType): boolean => {
  return type === 'goal-contribution' || type === 'goal-withdrawal';
};

/**
 * Get icon color for goal transactions
 */
export const getGoalIconColor = (type: TransactionType): string => {
  return type === 'goal-contribution' ? '#818cf8' : '#fbbf24';
};
