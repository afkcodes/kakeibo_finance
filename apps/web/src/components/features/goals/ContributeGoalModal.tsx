/**
 * @fileoverview Contribute/Withdraw from Goal Modal
 * @module @kakeibo/web/components/features/goals
 */

import type { Account, Goal } from '@kakeibo/core';
import { AlertCircle, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAccounts, useGoalActions } from '../../../hooks';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { ProgressBar } from '../../ui/ProgressBar';
import { Select } from '../../ui/Select';

interface ContributeGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
}

interface ContributionFormData {
  amount: number;
  accountId: string;
  description?: string;
}

export const ContributeGoalModal = ({ isOpen, onClose, goal }: ContributeGoalModalProps) => {
  const [isAdding, setIsAdding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accounts = useAccounts(goal?.userId);
  const { contributeToGoal, withdrawFromGoal } = useGoalActions();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<ContributionFormData>({
    defaultValues: {
      amount: 0,
      accountId: '',
      description: '',
    },
  });

  const watchAmount = watch('amount');
  const watchAccountId = watch('accountId');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        amount: 0,
        accountId: '',
        description: '',
      });
      setIsAdding(true);
      setError(null);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: ContributionFormData) => {
    setError(null);

    if (!data.accountId) {
      setError('Please select an account');
      return;
    }

    if (data.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      if (isAdding) {
        await contributeToGoal(goal.id, data.amount, data.accountId, data.description || undefined);
      } else {
        await withdrawFromGoal(goal.id, data.amount, data.accountId, data.description || undefined);
      }

      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process transaction');
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  // Quick amount buttons
  const quickAmounts = [100, 500, 1000, 5000];

  const handleQuickAmount = (amount: number) => {
    setValue('amount', amount);
  };

  // Account options with balances
  const accountOptions = useMemo(() => {
    if (!accounts) return [];

    const activeAccounts = accounts.filter((a: Account) => a.isActive);

    return activeAccounts.map((a: Account) => ({
      value: a.id,
      label: `${a.name} (${a.balance.toFixed(2)})`,
    }));
  }, [accounts]);

  // Selected account balance
  const selectedAccount = useMemo(() => {
    if (!watchAccountId || !accounts) return null;
    return accounts.find((a: Account) => a.id === watchAccountId);
  }, [watchAccountId, accounts]);

  // Validation checks
  const accountHasEnoughBalance = useMemo(() => {
    if (!isAdding || !selectedAccount || watchAmount <= 0) return true;
    return selectedAccount.balance >= watchAmount;
  }, [isAdding, selectedAccount, watchAmount]);

  const goalHasEnoughBalance = useMemo(() => {
    if (isAdding || !goal || watchAmount <= 0) return true;
    return goal.currentAmount >= watchAmount;
  }, [isAdding, goal, watchAmount]);

  const canSubmit =
    watchAmount > 0 && watchAccountId && accountHasEnoughBalance && goalHasEnoughBalance;

  // Early return if no goal
  if (!goal) return null;

  // Progress calculations
  const currentProgress = (goal.currentAmount / goal.targetAmount) * 100;
  const newAmount = isAdding
    ? goal.currentAmount + (watchAmount || 0)
    : goal.currentAmount - (watchAmount || 0);
  const newProgress = (newAmount / goal.targetAmount) * 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${isAdding ? 'Add to' : 'Withdraw from'} ${goal.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Add/Withdraw Toggle */}
        <div className="flex gap-2 p-1 bg-surface-800/60 rounded-lg">
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className={`
							flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md
							transition-all font-medium text-[14px]
							${
                isAdding
                  ? 'bg-success-500/20 text-success-400 border border-success-500/30'
                  : 'text-surface-400 hover:text-surface-300'
              }
						`}
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className={`
							flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md
							transition-all font-medium text-[14px]
							${
                !isAdding
                  ? 'bg-danger-500/20 text-danger-400 border border-danger-500/30'
                  : 'text-surface-400 hover:text-surface-300'
              }
						`}
          >
            <Minus className="w-4 h-4" />
            Withdraw
          </button>
        </div>

        {/* Current Progress */}
        <div className="p-3 bg-surface-800/40 border border-surface-700/30 rounded-lg space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-surface-300 text-[13px]">Current Progress</span>
            <span className="text-surface-100 text-[14px] font-semibold">
              {goal.currentAmount.toFixed(2)} / {goal.targetAmount.toFixed(2)}
            </span>
          </div>
          <ProgressBar value={currentProgress} />
          <p className="text-surface-400 text-[12px]">{currentProgress.toFixed(1)}% complete</p>
        </div>

        {/* Account Selection */}
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <Select
              label="Account"
              options={accountOptions}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select an account"
              helperText={
                selectedAccount ? `Available: ${selectedAccount.balance.toFixed(2)}` : undefined
              }
            />
          )}
        />

        {/* Amount Input */}
        <div className="space-y-2">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
            error={
              !accountHasEnoughBalance
                ? 'Insufficient account balance'
                : !goalHasEnoughBalance
                  ? 'Goal does not have enough funds'
                  : undefined
            }
          />

          {/* Quick Amounts */}
          <div className="flex gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickAmount(amt)}
                className="flex-1 py-2 px-3 bg-surface-800/60 hover:bg-surface-700/60 border border-surface-700/30 rounded-lg text-surface-300 text-[13px] font-medium transition-colors"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Description (Optional) */}
        <Input
          label="Note (Optional)"
          placeholder="e.g., Monthly savings"
          {...register('description')}
        />

        {/* Preview */}
        {watchAmount > 0 && canSubmit && (
          <div className="p-3 bg-surface-800/40 border border-surface-700/30 rounded-lg space-y-2">
            <p className="text-surface-300 text-[13px] font-medium">Preview</p>
            <div className="grid grid-cols-3 gap-2 text-[12px]">
              <div>
                <p className="text-surface-400">Account</p>
                <p className="text-surface-200 font-semibold">
                  {selectedAccount
                    ? `${selectedAccount.balance.toFixed(2)} → ${(selectedAccount.balance + (isAdding ? -watchAmount : watchAmount)).toFixed(2)}`
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-surface-400">Goal</p>
                <p className="text-surface-200 font-semibold">
                  {goal.currentAmount.toFixed(2)} → {newAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-surface-400">Progress</p>
                <p className="text-surface-200 font-semibold">
                  {currentProgress.toFixed(1)}% → {newProgress.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger-500/10 border border-danger-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-danger-400 shrink-0" />
            <p className="text-danger-400 text-[13px]">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={isAdding ? 'success' : 'danger'}
            className="flex-1"
            isLoading={isSubmitting}
            disabled={!canSubmit}
          >
            {isAdding ? 'Add Funds' : 'Withdraw'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
