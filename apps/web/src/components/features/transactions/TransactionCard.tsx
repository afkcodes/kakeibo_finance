import { cn } from '@kakeibo/core';
import {
  ArrowLeftRight,
  ArrowRight,
  MoreVertical,
  Pencil,
  ShieldCheck,
  Target,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CategoryIcon } from '../../ui';

export interface TransactionCardProps {
  id: string;
  description: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer' | 'goal-contribution' | 'goal-withdrawal';
  date: string;
  category?: {
    name: string;
    icon?: string;
    color?: string;
  };
  subcategory?: {
    name: string;
  };
  goalName?: string;
  accountName?: string;
  toAccountName?: string;
  isEssential?: boolean;
  formatCurrency: (amount: number) => string;
  formatDate?: (date: string) => string;
  onEdit?: () => void;
  onDelete: () => void;
  variant?: 'default' | 'compact';
}

export const TransactionCard = ({
  description,
  amount,
  type,
  date,
  category,
  subcategory,
  goalName,
  accountName,
  toAccountName,
  isEssential,
  formatCurrency,
  formatDate,
  onEdit,
  onDelete,
  variant = 'default',
}: TransactionCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isExpense = type === 'expense';
  const isIncome = type === 'income';
  const isTransfer = type === 'transfer';
  const isGoalContribution = type === 'goal-contribution';
  const isGoalWithdrawal = type === 'goal-withdrawal';
  const isGoalTransaction = isGoalContribution || isGoalWithdrawal;
  const isCompact = variant === 'compact';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete();
  };

  // Determine display values based on transaction type
  const getAmountColor = () => {
    if (isExpense) return 'text-danger-400';
    if (isIncome) return 'text-success-400';
    if (isGoalContribution) return 'text-primary-400';
    if (isGoalWithdrawal) return 'text-warning-400';
    return 'text-surface-100';
  };

  const getAmountPrefix = () => {
    if (isExpense) return '−';
    if (isIncome) return '+';
    return '';
  };

  const displayDate = formatDate ? formatDate(date) : new Date(date).toLocaleDateString();

  return (
    <div
      className={cn(
        'relative bg-surface-800/40 border border-surface-700/30 rounded-xl squircle',
        isCompact ? 'p-3' : 'p-4',
        'hover:bg-surface-800/60 transition-colors duration-200'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'rounded-lg flex items-center justify-center shrink-0',
            isCompact ? 'w-9 h-9' : 'w-12 h-12'
          )}
          style={{
            backgroundColor: `${category?.color || '#5B6EF5'}18`,
          }}
        >
          {isGoalTransaction ? (
            <Target
              className={cn(
                isGoalContribution ? 'text-primary-400' : 'text-warning-400',
                isCompact ? 'w-5 h-5' : 'w-6 h-6'
              )}
            />
          ) : isTransfer ? (
            <ArrowLeftRight className={cn('text-surface-300', isCompact ? 'w-5 h-5' : 'w-6 h-6')} />
          ) : (
            <CategoryIcon
              icon={category?.icon || 'circle-help'}
              color={category?.color || '#5B6EF5'}
              size={isCompact ? 'sm' : 'md'}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    'text-surface-100 font-semibold truncate',
                    isCompact ? 'text-[13px]' : 'text-[14px]'
                  )}
                >
                  {description}
                </h3>
                {isEssential && <ShieldCheck className="w-4 h-4 text-primary-400 shrink-0" />}
              </div>

              {/* Category/Goal Info */}
              <div className={cn('flex items-center gap-1.5', isCompact ? 'mt-0.5' : 'mt-1')}>
                {isGoalTransaction ? (
                  <>
                    <Target className="w-3.5 h-3.5 text-surface-500 shrink-0" />
                    <span className="text-surface-400 text-[12px]">{goalName}</span>
                  </>
                ) : isTransfer ? (
                  <>
                    <span className="text-surface-400 text-[12px]">{accountName}</span>
                    <ArrowRight className="w-3 h-3 text-surface-500" />
                    <span className="text-surface-400 text-[12px]">{toAccountName}</span>
                  </>
                ) : (
                  <span className="text-surface-400 text-[12px] truncate">
                    {category?.name}
                    {subcategory && ` • ${subcategory.name}`}
                  </span>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p
                className={cn(
                  'font-amount font-semibold',
                  isCompact ? 'text-[15px]' : 'text-[16px]',
                  getAmountColor()
                )}
              >
                {getAmountPrefix()}
                {formatCurrency(Math.abs(amount))}
              </p>
              <p className="text-surface-500 text-[11px] mt-0.5">{displayDate}</p>
            </div>
          </div>
        </div>

        {/* Menu Button */}
        {(onEdit || onDelete) && (
          <button
            ref={buttonRef}
            type="button"
            onClick={handleMenuToggle}
            className="shrink-0 p-1 hover:bg-surface-700/50 rounded-lg transition-colors duration-200"
          >
            <MoreVertical className="w-5 h-5 text-surface-400" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-full mt-1 z-50 bg-surface-800 border border-surface-700 rounded-xl shadow-xl overflow-hidden"
        >
          {onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] text-surface-200 hover:bg-surface-700/50 transition-colors duration-200"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] text-danger-400 hover:bg-danger-500/10 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
