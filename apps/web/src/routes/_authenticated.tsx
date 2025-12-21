import { createFileRoute, Outlet, type ParsedLocation, redirect } from '@tanstack/react-router';
import type { MyRouterContext } from './__root';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }: { context: MyRouterContext; location: ParsedLocation }) => {
    console.log('[_authenticated] beforeLoad - user:', context.auth.user);
    console.log('[_authenticated] beforeLoad - isLoading:', context.auth.isLoading);

    // Don't redirect while auth is loading
    if (context.auth.isLoading) {
      return;
    }

    // Allow access if user exists (guest or authenticated)
    if (context.auth.user) {
      return;
    }

    console.log('[_authenticated] No user - redirecting to /welcome');

    // No user - redirect to welcome
    throw redirect({
      to: '/welcome',
      search: {
        redirect: location.href,
      },
    });
  },
  component: () => <Outlet />,
});
