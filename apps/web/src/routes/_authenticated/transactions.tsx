import { createFileRoute } from '@tanstack/react-router';
import { TransactionsPage } from '../../pages/Transactions/TransactionsPage';

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPage,
});
