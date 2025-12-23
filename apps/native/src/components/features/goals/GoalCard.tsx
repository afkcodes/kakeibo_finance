/**
 * @fileoverview GoalCard - Main composition component
 * @module @kakeibo/native/components/features/goals
 *
 * Modular architecture with sub-components:
 * - GoalIcon: Savings/debt icon rendering
 * - GoalHeader: Title and type badge (inline)
 * - GoalProgress: Horizontal progress bar
 * - GoalFooter: Amount stats and deadline (inline)
 * - GoalMenu: Contribute/edit/delete dropdown
 */

import type { Goal } from '@kakeibo/core';
import { View } from 'react-native';
import { GoalFooter } from './GoalFooter';
import { GoalHeader } from './GoalHeader';
import { GoalIcon } from './GoalIcon';
import { GoalMenu } from './GoalMenu';
import { GoalProgress } from './GoalProgress';

export interface GoalCardProps {
  goal: Goal;
  currentAmount: number;
  progress: number;
  formatCurrency: (amount: number) => string;
  formatDate?: (date: string) => string;
  onContribute?: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  daysUntilDeadline?: number;
}

export const GoalCard = ({
  goal,
  progress,
  formatCurrency,
  formatDate,
  onContribute,
  onEdit,
  onDelete,
  daysUntilDeadline,
}: GoalCardProps) => {
  const isAlmostDone = progress >= 80;

  return (
    <View className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-3.5">
      <View className="flex-row items-center gap-3">
        {/* Icon */}
        <GoalIcon goal={goal} />

        {/* Content */}
        <View className="flex-1 min-w-0">
          {/* Header: Title + Type Badge */}
          <GoalHeader goal={goal} />

          {/* Progress Bar */}
          <GoalProgress percentage={progress} isAlmostDone={isAlmostDone} />

          {/* Footer: Amounts + Percentage + Deadline */}
          <GoalFooter
            goal={goal}
            percentage={progress}
            isAlmostDone={isAlmostDone}
            formatCurrency={formatCurrency}
            daysUntilDeadline={daysUntilDeadline}
            formatDate={formatDate}
          />
        </View>

        {/* Menu */}
        <GoalMenu goal={goal} onContribute={onContribute} onEdit={onEdit} onDelete={onDelete} />
      </View>
    </View>
  );
};
