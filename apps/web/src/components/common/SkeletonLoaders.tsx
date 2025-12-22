/**
 * @fileoverview Skeleton Loader Components
 * @module @kakeibo/web/components/common
 *
 * Reusable skeleton components for loading states
 */

/**
 * Base Skeleton Component
 */
export const Skeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
}: {
  className?: string;
  width?: string;
  height?: string;
}) => <div className={`${width} ${height} bg-surface-700/30 rounded animate-pulse ${className}`} />;

/**
 * Transaction Card Skeleton
 */
export const TransactionCardSkeleton = () => (
  <div className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-4 space-y-3">
    <div className="flex items-start gap-3">
      {/* Icon */}
      <Skeleton width="w-10" height="h-10" className="rounded-lg flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton width="w-3/4" height="h-4" />
        <Skeleton width="w-1/2" height="h-3" />
      </div>

      {/* Amount */}
      <div className="text-right space-y-2">
        <Skeleton width="w-20" height="h-5" />
        <Skeleton width="w-16" height="h-3" />
      </div>
    </div>
  </div>
);

/**
 * Budget Card Skeleton
 */
export const BudgetCardSkeleton = () => (
  <div className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-4 space-y-3">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton width="w-10" height="h-10" className="rounded-lg flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton width="w-2/3" height="h-4" />
          <Skeleton width="w-1/3" height="h-3" />
        </div>
      </div>
      <Skeleton width="w-6" height="h-6" className="rounded" />
    </div>

    {/* Progress Bar */}
    <div className="space-y-2">
      <Skeleton width="w-full" height="h-2" className="rounded-full" />
      <div className="flex justify-between">
        <Skeleton width="w-20" height="h-3" />
        <Skeleton width="w-16" height="h-3" />
      </div>
    </div>
  </div>
);

/**
 * Goal Card Skeleton
 */
export const GoalCardSkeleton = () => (
  <div className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-4 space-y-3">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton width="w-10" height="h-10" className="rounded-lg flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton width="w-2/3" height="h-4" />
          <Skeleton width="w-1/2" height="h-3" />
        </div>
      </div>
      <Skeleton width="w-6" height="h-6" className="rounded" />
    </div>

    {/* Progress Bar */}
    <div className="space-y-2">
      <Skeleton width="w-full" height="h-2" className="rounded-full" />
      <div className="flex justify-between">
        <Skeleton width="w-24" height="h-3" />
        <Skeleton width="w-16" height="h-3" />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2 pt-2">
      <Skeleton width="w-full" height="h-9" className="rounded-lg" />
      <Skeleton width="w-full" height="h-9" className="rounded-lg" />
    </div>
  </div>
);

/**
 * Account Card Skeleton
 */
export const AccountCardSkeleton = () => (
  <div className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton width="w-12" height="h-12" className="rounded-lg flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton width="w-1/2" height="h-4" />
          <Skeleton width="w-2/3" height="h-6" />
          <Skeleton width="w-1/3" height="h-3" />
        </div>
      </div>
      <Skeleton width="w-6" height="h-6" className="rounded" />
    </div>
  </div>
);

/**
 * List Skeleton - Multiple Cards
 */
export const TransactionListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-2.5">
    {Array.from({ length: count }).map((_, i) => (
      <TransactionCardSkeleton key={i} />
    ))}
  </div>
);

export const BudgetListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-2.5">
    {Array.from({ length: count }).map((_, i) => (
      <BudgetCardSkeleton key={i} />
    ))}
  </div>
);

export const GoalListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-2.5">
    {Array.from({ length: count }).map((_, i) => (
      <GoalCardSkeleton key={i} />
    ))}
  </div>
);

export const AccountListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-2.5">
    {Array.from({ length: count }).map((_, i) => (
      <AccountCardSkeleton key={i} />
    ))}
  </div>
);
