import { createFileRoute } from '@tanstack/react-router';
import { AnalyticsPage } from '../../pages/Analytics/AnalyticsPage';

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsPage,
});
