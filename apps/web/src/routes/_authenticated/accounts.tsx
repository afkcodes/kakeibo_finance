import { createFileRoute } from '@tanstack/react-router';
import { AccountsPage } from '../../pages/Accounts/AccountsPage';

export const Route = createFileRoute('/_authenticated/accounts')({
  component: AccountsPage,
});
