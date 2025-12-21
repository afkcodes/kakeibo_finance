import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => {
    // Check if user has seen welcome page
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';

    // New users → Welcome page
    // Returning users → Dashboard
    return hasSeenWelcome ? <Navigate to="/dashboard" /> : <Navigate to="/welcome" />;
  },
});
