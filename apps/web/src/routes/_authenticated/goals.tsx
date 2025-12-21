import { createFileRoute } from '@tanstack/react-router';
import { GoalsPage } from '../../pages/Goals/GoalsPage';

export const Route = createFileRoute('/_authenticated/goals')({
  component: GoalsPage,
});
