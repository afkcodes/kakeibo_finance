/**
 * @fileoverview Add/Edit Transaction Modal
 * @module @kakeibo/web/components/features/transactions
 */

import { zodResolver } from '@hookform/resolvers/zod';
import type { Account, Category, Transaction, TransactionType } from '@kakeibo/core';
import { createTransactionSchema, getSubcategoriesForCategory } from '@kakeibo/core';
import { format } from 'date-fns';
import { ArrowRightLeft, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useAccounts, useCategories, useCurrency, useTransactionActions } from '../../../hooks';
import { Button } from '../../ui/Button';
import type { CategorySelection } from '../../ui/CategorySelect';
import { CategorySelect } from '../../ui/CategorySelect';
import { Checkbox } from '../../ui/Checkbox';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Select } from '../../ui/Select';

type TransactionFormData = z.infer<typeof createTransactionSchema>;

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  editingTransaction?: Transaction;
}

const typeConfig: Record<
  'expense' | 'income' | 'transfer',
  { icon: typeof Minus; color: string; bg: string; label: string }
> = {
  expense: {
    icon: Minus,
    color: 'text-danger-400',
    bg: 'bg-danger-500',
    label: 'Expense',
  },
  income: {
    icon: Plus,
    color: 'text-success-400',
    bg: 'bg-success-500',
    label: 'Income',
  },
  transfer: {
    icon: ArrowRightLeft,
    color: 'text-primary-400',
    bg: 'bg-primary-500',
    label: 'Transfer',
  },
};

export const AddTransactionModal = ({
  isOpen,
  onClose,
  userId,
  editingTransaction,
}: AddTransactionModalProps) => {
  const accounts = useAccounts(userId);
  const categories = useCategories(userId);
  const { currencySymbol } = useCurrency();
  const { addTransaction, updateTransaction } = useTransactionActions();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeType, setActiveType] = useState<TransactionType>('expense');

  const isEditing = !!editingTransaction;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      description: '',
      categoryId: '',
      subcategoryId: undefined,
      accountId: '',
      isEssential: false,
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setActiveType('expense');
      reset({
        type: 'expense',
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        description: '',
        categoryId: '',
        subcategoryId: undefined,
        accountId: '',
        isEssential: false,
      });
      return;
    }

    if (editingTransaction && accounts && accounts.length > 0) {
      const txType = editingTransaction.type;

      if (txType === 'goal-contribution' || txType === 'goal-withdrawal') {
        onClose();
        return;
      }

      setActiveType(txType);
      setTimeout(() => {
        reset({
          type: txType,
          amount: editingTransaction.amount.toString(),
          description: editingTransaction.description,
          categoryId: editingTransaction.categoryId || '',
          subcategoryId: editingTransaction.subcategoryId,
          accountId: editingTransaction.accountId,
          date: format(new Date(editingTransaction.date), 'yyyy-MM-dd'),
          toAccountId: editingTransaction.toAccountId || '',
          isEssential: editingTransaction.isEssential || false,
        });
      }, 0);
    }
  }, [isOpen, editingTransaction, reset, accounts, onClose]);

  const filteredCategories =
    categories?.filter(
      (c: Category) => c.type === (activeType === 'transfer' ? 'expense' : activeType)
    ) || [];

  // Get all subcategories for filtered categories
  const allSubcategories = useMemo(() => {
    const subs: Array<{ id: string; name: string; categoryId: string }> = [];
    filteredCategories.forEach((category) => {
      const categorySubs = getSubcategoriesForCategory(category.name);
      categorySubs.forEach((sub) => {
        subs.push({
          ...sub,
          categoryId: category.id,
        });
      });
    });
    return subs;
  }, [filteredCategories]);

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
      } else {
        await addTransaction(userId, data);
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const currentTypeConfig = typeConfig[activeType as 'expense' | 'income' | 'transfer'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="flex-1"
          >
            {isEditing ? 'Save' : 'Add'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type Selector */}
        <div className="flex bg-surface-800 rounded-lg p-1">
          {(['expense', 'income', 'transfer'] as const).map((type) => {
            const config = typeConfig[type];
            const Icon = config.icon;
            const isActive = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setActiveType(type);
                  setValue('type', type);
                  setValue('categoryId', '');
                  setValue('subcategoryId', undefined);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive ? `${config.bg} text-white` : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            );
          })}
        </div>

        <input type="hidden" {...register('type')} value={activeType} />

        {/* Amount */}
        <div
          className={`flex items-center gap-2 px-3 h-11 rounded-xl border transition-colors ${
            activeType === 'expense'
              ? 'border-danger-500/50 bg-danger-500/5'
              : activeType === 'income'
                ? 'border-success-500/50 bg-success-500/5'
                : 'border-primary-500/50 bg-primary-500/5'
          }`}
        >
          <span
            className={`flex items-center gap-0.5 text-base font-medium ${currentTypeConfig.color}`}
          >
            {activeType === 'expense' && <Minus className="w-4 h-4" />}
            {activeType === 'income' && <Plus className="w-4 h-4" />}
            {currencySymbol}
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('amount')}
            className={`flex-1 bg-transparent text-base font-semibold outline-none h-full ${currentTypeConfig.color} placeholder:text-surface-500 placeholder:font-normal`}
          />
        </div>
        {errors.amount && <p className="text-danger-400 text-xs -mt-2">{errors.amount.message}</p>}

        {/* Description */}
        <Input
          label="Description"
          placeholder="What's this for?"
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Category or Transfer Accounts */}
        {activeType === 'transfer' ? (
          <div className="flex items-center gap-2">
            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <Select
                  label="From"
                  options={accounts?.map((a: Account) => ({ value: a.id, label: a.name })) || []}
                  placeholder="Account"
                  error={errors.accountId?.message}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex-1"
                />
              )}
            />
            <ArrowRightLeft className="w-4 h-4 text-surface-500 mt-6 shrink-0" />
            <Controller
              name="toAccountId"
              control={control}
              render={({ field }) => (
                <Select
                  label="To"
                  options={
                    accounts
                      ?.filter((a: Account) => a.id !== watch('accountId'))
                      .map((a: Account) => ({ value: a.id, label: a.name })) || []
                  }
                  placeholder="Account"
                  error={errors.toAccountId?.message}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  className="flex-1"
                />
              )}
            />
          </div>
        ) : (
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategorySelect
                label="Category"
                options={filteredCategories.map((c: Category) => ({
                  value: c.id,
                  label: c.name,
                  icon: c.icon,
                  color: c.color,
                }))}
                subcategories={allSubcategories}
                placeholder="Search categories..."
                value={field.value || ''}
                subcategoryValue={watch('subcategoryId')}
                onSelectionChange={(selection: CategorySelection) => {
                  field.onChange(selection.categoryId);
                  setValue('subcategoryId', selection.subcategoryId);
                }}
                error={errors.categoryId?.message}
              />
            )}
          />
        )}

        {/* Account & Date */}
        {activeType !== 'transfer' && (
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="accountId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Account"
                  options={accounts?.map((a: Account) => ({ value: a.id, label: a.name })) || []}
                  placeholder="Select"
                  error={errors.accountId?.message}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
          </div>
        )}

        {/* Date for transfers */}
        {activeType === 'transfer' && (
          <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
        )}

        {/* Essential expense checkbox */}
        {activeType === 'expense' && (
          <Controller
            name="isEssential"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Essential Expense"
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        )}
      </form>
    </Modal>
  );
};
