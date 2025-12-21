import { Outlet } from '@tanstack/react-router';
import { BottomNav } from '../BottomNav';
import { FloatingActionButton } from '../FloatingActionButton';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';

export const AppShell = () => {
  // TODO: Connect to store once available
  const sidebarOpen = true; // Placeholder

  // TODO: Initialize auth when available
  // TODO: Initialize default categories when available
  // TODO: Apply theme when available

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Navbar - Desktop only */}
        <Navbar className="hidden lg:flex" />

        {/* Page Content */}
        <main className="px-4 py-4 pb-24 lg:py-6 lg:pb-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating Action Button - Mobile only */}
      <FloatingActionButton />

      {/* TODO: Add modals when feature components are available */}
      {/* TODO: Add PWA prompts when PWA support is added */}
    </div>
  );
};
