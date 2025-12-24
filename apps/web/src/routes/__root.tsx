import { createRootRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightLeft,
  BarChart3,
  LayoutDashboard,
  PieChart,
  PiggyBank,
  Plus,
  Target,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { AddAccountModal } from '../components/features/accounts/AddAccountModal';
import { AddBudgetModal } from '../components/features/budgets/AddBudgetModal';
import { AddGoalModal } from '../components/features/goals/AddGoalModal';
import { AddTransactionModal } from '../components/features/transactions/AddTransactionModal';
import { useAuth } from '../hooks/useAuth';
import { OfflineBanner } from '../hooks/useNetworkStatus';
import { ensureDatabaseInitialized } from '../services/db/initializeDatabase';
import { useAppStore } from '../store';

export const Route = createRootRoute({
  component: RootLayout,
});

const navigationItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { path: '/budgets', label: 'Budgets', icon: PiggyBank },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/accounts', label: 'Accounts', icon: Wallet },
];

function RootLayout() {
  const location = useLocation();

  // Initialize auth - this will handle OAuth callback and session management
  useAuth();

  // Use selectors to avoid unnecessary re-renders when unrelated store state changes
  const activeModal = useAppStore((state) => state.activeModal);
  const setActiveModal = useAppStore((state) => state.setActiveModal);
  const currentUser = useAppStore((state) => state.currentUser);
  const editingTransaction = useAppStore((state) => state.editingTransaction);
  const editingBudget = useAppStore((state) => state.editingBudget);

  // Initialize database with default categories on first load
  // Empty dependency array ensures this only runs once on mount
  useEffect(() => {
    const userId = useAppStore.getState().currentUser.id;
    ensureDatabaseInitialized(userId).catch((error) => {
      console.error('Failed to initialize database:', error);
      // Note: Don't show toast here as it happens on app load before ToastRoot is mounted
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Determine FAB config based on current route
  const fabConfig = useMemo(() => {
    const path = location.pathname;

    if (path.startsWith('/settings') || path.startsWith('/analytics')) {
      return null;
    }

    if (path.startsWith('/budgets')) {
      return { modal: 'add-budget' as const, icon: PieChart };
    }

    if (path.startsWith('/goals')) {
      return { modal: 'add-goal' as const, icon: Target };
    }

    if (path.startsWith('/accounts')) {
      return { modal: 'add-account' as const, icon: Wallet };
    }

    return { modal: 'add-transaction' as const, icon: Plus };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* Main Content */}
      <main className="px-4 py-4 pb-24">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-surface-900 border-t border-surface-700 px-1 pb-safe">
          <div className="flex items-center justify-around h-14">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center flex-1 py-1.5 min-w-0"
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive ? 'text-primary-400' : 'text-surface-500'
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 truncate ${
                      isActive ? 'text-primary-400' : 'text-surface-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Floating Action Button */}
      {fabConfig && (
        <AnimatePresence>
          <motion.button
            key={fabConfig.modal}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveModal(fabConfig.modal)}
            className="fixed right-4 bottom-24 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-primary-500 hover:bg-primary-600 shadow-primary-500/30 transition-colors duration-200"
          >
            <fabConfig.icon className="w-6 h-6 text-white" />
          </motion.button>
        </AnimatePresence>
      )}

      {/* Modals */}
      <AddTransactionModal
        isOpen={activeModal === 'add-transaction'}
        onClose={() => setActiveModal(null)}
        userId={currentUser.id}
        editingTransaction={editingTransaction ?? undefined}
      />
      <AddBudgetModal
        isOpen={activeModal === 'add-budget'}
        onClose={() => setActiveModal(null)}
        userId={currentUser.id}
        editingBudget={editingBudget ?? undefined}
      />
      <AddGoalModal />
      <AddAccountModal
        isOpen={activeModal === 'add-account'}
        onClose={() => setActiveModal(null)}
        userId={currentUser.id}
      />
    </div>
  );
}
