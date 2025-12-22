import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAppStore } from '../store/appStore';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // Check if user has completed onboarding (seen welcome screen)
    const hasCompletedOnboarding = useAppStore.getState().hasCompletedOnboarding;

    // If haven't completed onboarding, redirect to welcome
    if (!hasCompletedOnboarding) {
      throw redirect({
        to: '/welcome',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
