/**
 * @fileoverview Add/Edit Budget Modal
 * @module @kakeibo/web/components/features/budgets
 */

import { zodResolver } from '@hookform/resolvers/zod';
import type { Budget, Category } from '@kakeibo/core';
import { createBudgetSchema } from '@kakeibo/core';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useId, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useBudgetActions, useBudgets, useCategories } from '../../../hooks';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import type { MultiCategoryOption } from '../../ui/MultiCategorySelect';
import { MultiCategorySelect } from '../../ui/MultiCategorySelect';
import { Select } from '../../ui/Select';

type BudgetFormData = z.infer<typeof createBudgetSchema>;

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  editingBudget?: Budget;
}

export const AddBudgetModal = ({ isOpen, onClose, userId, editingBudget }: AddBudgetModalProps) => {
  const rolloverId = useId();
  const isActiveId = useId();
  const categories = useCategories(userId);
  const budgets = useBudgets(userId);
  const { addBudget, updateBudget } = useBudgetActions();

  const isEditing = !!editingBudget;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      name: '',
      categoryIds: [],
      amount: 0,
      period: 'monthly',
      rollover: false,
      isActive: true,
    },
  });

  const watchedCategoryIds = watch('categoryIds');

  // Check for existing budget with same categories
  const existingBudgetWarning = useMemo(() => {
    if (!watchedCategoryIds?.length || isEditing || !budgets) return null;

    const hasSameCategories = budgets.some((b) => {
      // Skip if this is the same budget being edited
      if (editingBudget && b.id === (editingBudget as Budget).id) return false;
      if (b.categoryIds.length !== watchedCategoryIds.length) return false;
      return b.categoryIds.every((id) => watchedCategoryIds.includes(id));
    });

    return hasSameCategories ? 'A budget with these exact categories already exists' : null;
  }, [watchedCategoryIds, budgets, isEditing, editingBudget]);

  // Reset form with editing budget data when modal opens
  useEffect(() => {
    if (isOpen && editingBudget) {
      reset({
        name: editingBudget.name ?? '',
        categoryIds: editingBudget.categoryIds || [],
        amount: editingBudget.amount,
        period: editingBudget.period,
        rollover: editingBudget.rollover,
        isActive: editingBudget.isActive ?? true,
      });
    } else if (isOpen && !editingBudget) {
      reset({
        name: '',
        categoryIds: [],
        amount: 0,
        period: 'monthly',
        rollover: false,
        isActive: true,
      });
    }
  }, [isOpen, editingBudget, reset]);

  const onSubmit = async (data: BudgetFormData) => {
    if (isEditing && editingBudget) {
      await updateBudget(editingBudget.id, data);
    } else {
      // Calculate start date based on period
      const now = new Date();
      let startDate: Date;

      if (data.period === 'weekly') {
        const day = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day);
      } else if (data.period === 'yearly') {
        startDate = new Date(now.getFullYear(), 0, 1);
      } else {
        // Monthly - use first of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      await addBudget(userId, {
        ...data,
        startDate: startDate.toISOString(),
      });
    }

    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Filter to expense categories only for budgets
  const expenseCategories: MultiCategoryOption[] = useMemo(() => {
    if (!categories) return [];
    return categories
      .filter((c: Category) => c.type === 'expense')
      .map((c: Category) => ({
        value: c.id,
        label: c.name,
        icon: c.icon,
        color: c.color,
      }));
  }, [categories]);

  const periodOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  // Get selected category names for display
  const selectedCategoryNames = useMemo(() => {
    if (!watchedCategoryIds || !categories) return '';
    return watchedCategoryIds
      .map((id) => categories.find((c: Category) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }, [watchedCategoryIds, categories]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Budget' : 'Create Budget'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Budget Name */}
        <Input
          label="Budget Name"
          placeholder="e.g., Entertainment, Monthly Bills"
          {...register('name')}
          error={errors.name?.message}
        />

        {/* Category Selection */}
        <Controller
          name="categoryIds"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <MultiCategorySelect
                label="Categories"
                categories={expenseCategories}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select categories to track"
                error={errors.categoryIds?.message}
                helperText={
                  field.value.length > 0
                    ? `Tracking: ${selectedCategoryNames}`
                    : 'Select one or more categories to include in this budget'
                }
              />

              {/* Warning for existing budget */}
              {existingBudgetWarning && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-warning-500/10 border border-warning-500/30 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-warning-400 shrink-0" />
                  <p className="text-warning-400 text-[12px]">{existingBudgetWarning}</p>
                </div>
              )}
            </div>
          )}
        />

        {/* Amount */}
        <Input
          label="Budget Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
          error={errors.amount?.message}
        />

        {/* Period */}
        <Controller
          name="period"
          control={control}
          render={({ field }) => (
            <Select
              label="Period"
              options={periodOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.period?.message}
            />
          )}
        />

        {/* Rollover */}
        <Controller
          name="rollover"
          control={control}
          render={({ field }) => (
            <Checkbox
              id={rolloverId}
              checked={field.value || false}
              onCheckedChange={field.onChange}
              label="Rollover unused budget to next period"
            />
          )}
        />

        {/* Active toggle (only show when editing) */}
        {isEditing && (
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                id={isActiveId}
                checked={field.value ?? true}
                onCheckedChange={field.onChange}
                label="Budget is active"
              />
            )}
          />
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={isSubmitting}
            disabled={!!existingBudgetWarning}
          >
            {isEditing ? 'Save Changes' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
