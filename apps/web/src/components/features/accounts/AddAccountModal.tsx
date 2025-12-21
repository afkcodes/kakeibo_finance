/**
 * @fileoverview Add/Edit Account Modal
 * @module @kakeibo/web/components/features/accounts
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { createAccountSchema } from '@kakeibo/core';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useAccountActions } from '../../../hooks';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Select } from '../../ui/Select';

type AccountFormData = z.infer<typeof createAccountSchema>;

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const typeOptions = [
  { value: 'bank', label: 'Bank Account' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'investment', label: 'Investment' },
  { value: 'wallet', label: 'Digital Wallet' },
];

const colorOptions = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Yellow' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#6b7280', label: 'Gray' },
];

export const AddAccountModal = ({ isOpen, onClose, userId }: AddAccountModalProps) => {
  const { addAccount } = useAccountActions();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'bank',
      balance: 0,
      currency: 'USD',
      color: '#3b82f6',
      icon: 'wallet',
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    await addAccount(userId, data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Account" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Account Name"
          placeholder="e.g., Main Checking, Savings"
          {...register('name')}
          error={errors.name?.message}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Account Type"
              options={typeOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.type?.message}
            />
          )}
        />

        <Input
          label="Current Balance"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('balance', { valueAsNumber: true })}
          error={errors.balance?.message}
          helperText="For credit cards, enter negative balance if you owe money"
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <Select
              label="Color"
              options={colorOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.color?.message}
            />
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isSubmitting}>
            Add Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};
