import type { Budget, BudgetProgress, Category } from '@kakeibo/core';
import { financialMonthEndDate } from '@kakeibo/core';
import { AlertTriangle, MoreVertical, Pencil, PieChart, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BudgetListSkeleton } from '../../components/common';
import { Button, CategoryIcon, Modal } from '../../components/ui';
import { useBudgetActions, useBudgetProgress, useCategories, useCurrency } from '../../hooks';
import { useAppStore } from '../../store/appStore';

// Get budget categories from categoryMap (handles both old and new format)
const getBudgetCategories = (budget: Budget, categoryMap: Record<string, Category>): Category[] => {
  // Handle new format (categoryIds array) and old format (categoryId string)
  let categoryIds: string[] = [];
  if (Array.isArray(budget.categoryIds) && budget.categoryIds.length > 0) {
    categoryIds = budget.categoryIds;
  } else {
    // Handle old budget format (single category)
    const oldCategoryId = (budget as Budget & { categoryId?: string }).categoryId;
    if (oldCategoryId) {
      categoryIds = [oldCategoryId];
    }
  }
  return categoryIds.map((id) => categoryMap[id]).filter(Boolean);
};

// Get budget display name
const getBudgetDisplayName = (budget: Budget, budgetCategories: Category[]): string => {
  // If budget has a custom name, use it
  if (budget.name) return budget.name;

  // Otherwise, auto-generate based on categories
  if (budgetCategories.length === 0) return 'Unknown';
  if (budgetCategories.length === 1) return budgetCategories[0].name;
  if (budgetCategories.length === 2) return budgetCategories.map((c) => c.name).join(' & ');
  return `${budgetCategories[0].name} +${budgetCategories.length - 1} more`;
};

// Alert badge component
const AlertBadge = ({ progress }: { progress: BudgetProgress }) => {
  if (progress.activeAlerts.length === 0) return null;

  const highestAlert = progress.activeAlerts[0]; // Already sorted descending

  if (highestAlert >= 100) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-danger-500/20 text-danger-400 border border-danger-500/30">
        <AlertTriangle className="w-3 h-3" />
        Over
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-warning-500/20 text-warning-400 border border-warning-500/30">
      <AlertTriangle className="w-3 h-3" />
      {highestAlert}%
    </span>
  );
};

export const BudgetsPage = () => {
  const { currentUser, setActiveModal, setEditingBudget, settings } = useAppStore();
  const { formatCurrency } = useCurrency();
  const budgetProgress = useBudgetProgress(currentUser.id);
  const categories = useCategories(currentUser.id);
  const { deleteBudget } = useBudgetActions();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setActiveModal('add-budget');
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    await deleteBudget(budgetToDelete.id);
    setBudgetToDelete(null);
    setOpenMenuId(null);
  };

  // Create a map of category id to category for quick lookup
  const categoryMap = useMemo(() => {
    if (!categories) return {};
    return categories.reduce(
      (acc, cat) => {
        acc[cat.id] = cat;
        return acc;
      },
      {} as Record<string, Category>
    );
  }, [categories]);

  // Calculate overview stats
  const stats = useMemo(() => {
    if (!budgetProgress) {
      return { totalBudget: 0, totalSpent: 0, remaining: 0, percentage: 0, budgetsWithAlerts: 0 };
    }
    const totalBudget = budgetProgress.reduce((sum, b) => sum + b.budget.amount, 0);
    const totalSpent = budgetProgress.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalBudget - totalSpent;
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const budgetsWithAlerts = budgetProgress.filter((b) => b.activeAlerts.length > 0).length;
    return { totalBudget, totalSpent, remaining, percentage, budgetsWithAlerts };
  }, [budgetProgress]);

  // Days remaining in month
  const daysRemaining = useMemo(() => {
    const now = new Date();
    const end = financialMonthEndDate(now, settings.financialMonthStart ?? 1);
    // difference in days
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [settings.financialMonthStart]);

  if (!budgetProgress || !categories) {
    return (
      <div className="min-h-full pb-6 animate-fade-in">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-surface-50 tracking-tight">Budgets</h1>
        </div>
        <div className="text-center py-20">
          <p className="text-surface-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-surface-50 tracking-tight">Budgets</h1>
        <p className="text-surface-500 text-[14px] mt-0.5">{daysRemaining} days left this month</p>
      </div>

      {/* Overview Card */}
      {budgetProgress.length > 0 && (
        <div className="bg-surface-800/40 border border-surface-700/30 rounded-xl squircle p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-surface-500 text-[13px] font-medium">Monthly Overview</p>
              <p className="text-surface-50 text-[28px] font-bold font-amount mt-1">
                {formatCurrency(stats.totalSpent)}
              </p>
              <p className="text-surface-500 text-[13px]">
                of {formatCurrency(stats.totalBudget)} budgeted
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-[24px] font-bold font-amount ${stats.remaining >= 0 ? 'text-success-400' : 'text-danger-400'}`}
              >
                {stats.remaining >= 0
                  ? formatCurrency(stats.remaining)
                  : `−${formatCurrency(Math.abs(stats.remaining))}`}
              </div>
              <p className="text-surface-500 text-[13px]">
                {stats.remaining >= 0 ? 'remaining' : 'over budget'}
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="h-2.5 bg-surface-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                stats.percentage > 100
                  ? 'bg-danger-500'
                  : stats.percentage > 80
                    ? 'bg-warning-500'
                    : 'bg-success-500'
              }`}
              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-surface-500 text-[12px]">
              {stats.percentage.toFixed(0)}% of total budget used
            </p>
            {stats.budgetsWithAlerts > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-warning-400">
                <AlertTriangle className="w-3 h-3" />
                {stats.budgetsWithAlerts} alert{stats.budgetsWithAlerts > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Budget List */}
      {budgetProgress === undefined ? (
        <BudgetListSkeleton count={4} />
      ) : budgetProgress.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-xl squircle bg-surface-800/50 flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-7 h-7 text-surface-600" />
          </div>
          <p className="text-surface-300 font-semibold text-[15px]">No budgets yet</p>
          <p className="text-surface-500 text-[13px] mt-1.5 max-w-60 mx-auto mb-5">
            Create budgets to track spending by category
          </p>
          <button
            type="button"
            onClick={() => setActiveModal('add-budget')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-semibold rounded-xl squircle transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Budget
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {budgetProgress.map((bp) => {
            const budgetCategories = getBudgetCategories(bp.budget, categoryMap);
            const displayName = getBudgetDisplayName(bp.budget, budgetCategories);
            const primaryCategory = budgetCategories[0];
            const isOverBudget = bp.isOverBudget;
            const hasWarning = bp.isWarning;

            return (
              <div
                key={bp.budget.id}
                className="relative flex items-center gap-3 bg-surface-800/40 border border-surface-700/30 rounded-xl squircle p-3.5"
              >
                {/* Category Icon - show primary category or multi-icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${primaryCategory?.color || '#6b7280'}18` }}
                >
                  {budgetCategories.length > 1 ? (
                    <PieChart
                      className="w-5 h-5"
                      style={{ color: primaryCategory?.color || '#6b7280' }}
                    />
                  ) : (
                    <CategoryIcon
                      icon={primaryCategory?.icon || 'more-horizontal'}
                      color={primaryCategory?.color}
                      size="sm"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-surface-100 text-[14px] font-semibold truncate">
                        {displayName}
                      </p>
                      <AlertBadge progress={bp} />
                    </div>
                    <p
                      className={`font-bold font-amount text-[14px] shrink-0 ml-2 ${
                        isOverBudget
                          ? 'text-danger-400'
                          : hasWarning
                            ? 'text-warning-400'
                            : 'text-surface-100'
                      }`}
                    >
                      {formatCurrency(bp.spent)}{' '}
                      <span className="text-surface-500 font-normal">
                        / {formatCurrency(bp.budget.amount)}
                      </span>
                    </p>
                  </div>

                  {/* Category chips for multi-category budgets */}
                  {budgetCategories.length > 1 && (
                    <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                      {budgetCategories.slice(0, 3).map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] bg-surface-700/50"
                          style={{ color: cat.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </span>
                      ))}
                      {budgetCategories.length > 3 && (
                        <span className="text-surface-500 text-[10px]">
                          +{budgetCategories.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-surface-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOverBudget
                          ? 'bg-danger-500'
                          : hasWarning
                            ? 'bg-warning-500'
                            : 'bg-primary-500'
                      }`}
                      style={{ width: `${Math.min(bp.percentage, 100)}%` }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className={`text-[11px] font-medium ${
                        isOverBudget
                          ? 'text-danger-400'
                          : hasWarning
                            ? 'text-warning-400'
                            : 'text-success-400'
                      }`}
                    >
                      {isOverBudget ? 'Over budget' : hasWarning ? 'Almost there' : 'On track'}
                    </span>
                    <div className="flex items-center gap-3">
                      {/* Daily average insight */}
                      <span className="text-[10px] text-surface-500">
                        ~{formatCurrency(bp.dailyAverage)}/day
                      </span>
                      <span
                        className={`text-[11px] font-medium font-amount ${
                          isOverBudget ? 'text-danger-400' : 'text-surface-400'
                        }`}
                      >
                        {isOverBudget
                          ? `−${formatCurrency(Math.abs(bp.remaining))}`
                          : `${formatCurrency(bp.remaining)} left`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3-dot Menu */}
                <div
                  className="relative shrink-0"
                  ref={openMenuId === bp.budget.id ? menuRef : null}
                >
                  <button
                    type="button"
                    className="p-1.5 -mr-1 rounded-lg active:bg-surface-700/50 text-surface-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === bp.budget.id ? null : bp.budget.id);
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openMenuId === bp.budget.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-surface-800 border border-surface-700 rounded-xl squircle shadow-xl z-50 py-1 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                      <button
                        type="button"
                        className="w-full px-4 py-2.5 text-left text-sm text-surface-200 active:bg-surface-700/50 flex items-center gap-3 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBudget(bp.budget);
                        }}
                      >
                        <Pencil className="w-4 h-4 text-surface-400" />
                        Edit Budget
                      </button>
                      <div className="h-px bg-surface-700 my-1" />
                      <button
                        type="button"
                        className="w-full px-4 py-2.5 text-left text-sm text-danger-400 active:bg-danger-500/10 flex items-center gap-3 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBudgetToDelete(bp.budget);
                          setOpenMenuId(null);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
        title="Delete Budget"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-surface-300 text-[14px]">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-surface-100">
              "{budgetToDelete?.name || 'this budget'}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setBudgetToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
