import { StateNavigator } from 'navigation';

// Single flat navigator - all routes in one place (like twitter example)
export const stateNavigator = new StateNavigator([
  // Welcome screen (initial state for new users)
  {
    key: 'welcome',
    route: 'welcome',
  },

  // Tabs container (main app after onboarding)
  {
    key: 'tabs',
  },

  // Hub routes
  {
    key: 'hub',
    route: 'hub',
    trackCrumbTrail: false,
  },

  // Transaction routes
  {
    key: 'transactions',
    route: 'transactions',
    trackCrumbTrail: false,
  },

  // Analytics routes
  {
    key: 'analytics',
    route: 'analytics',
    trackCrumbTrail: false,
  },

  // Plan routes (container for budgets and goals)
  {
    key: 'plan',
    route: 'plan',
    trackCrumbTrail: false,
  },
  {
    key: 'budgets',
    route: 'budgets',
    trackCrumbTrail: false,
  },
  {
    key: 'goals',
    route: 'goals',
    trackCrumbTrail: false,
  },

  // More routes (settings hub)
  {
    key: 'more',
    route: 'more',
    trackCrumbTrail: false,
  },
]);
