import { createFileRoute } from '@tanstack/react-router';
import { BudgetsPage } from '../../pages/Budgets/BudgetsPage';

export const Route = createFileRoute('/_authenticated/budgets')({
  component: BudgetsPage,
});
