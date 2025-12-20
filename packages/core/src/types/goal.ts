/**
 * @fileoverview Goal type definitions and utilities
 * @module @kakeibo/core/types
 *
 * Defines the Goal entity for tracking savings goals and debt payoff.
 * Includes progress calculation and milestone tracking.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Types of goals supported
 */
export type GoalType = 'savings' | 'debt';

/**
 * Goal lifecycle status
 */
export type GoalStatus = 'active' | 'completed' | 'cancelled';

/**
 * Goal entity representing a financial target
 *
 * Goals help users save towards specific targets (vacation, emergency fund)
 * or pay down debt systematically.
 */
export interface Goal {
  /** Unique identifier */
  id: string;

  /** Owner user ID */
  userId: string;

  /** Goal name (e.g., "Emergency Fund", "Vacation to Japan") */
  name: string;

  /** Goal type - savings or debt payoff */
  type: GoalType;

  /** Target amount to reach */
  targetAmount: number;

  /** Current amount saved/paid */
  currentAmount: number;

  /** Optional deadline */
  deadline?: Date;

  /** Optional linked account (where funds are held) */
  accountId?: string;

  /** Display color (hex format) */
  color: string;

  /** Display icon name */
  icon: string;

  /** Current status */
  status: GoalStatus;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Goal milestone tracking
 */
export interface GoalMilestone {
  /** Milestone ID */
  id: string;

  /** Associated goal ID */
  goalId: string;

  /** Milestone name (e.g., "25% Complete", "Halfway There") */
  name: string;

  /** Target amount for this milestone */
  targetAmount: number;

  /** When milestone was reached (undefined if not reached yet) */
  reachedAt?: Date;
}
