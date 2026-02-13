import { Badge } from '@/app/components/ui/badge';
import type { TournamentStatus } from '@/app/types';

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
}

const statusConfig: Record<TournamentStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'new' | 'live'; label: string }> = {
  DRAFT: { variant: 'secondary', label: 'Draft' },
  PENDING_APPROVAL: { variant: 'warning', label: 'Pending' },
  APPROVED: { variant: 'success', label: 'Approved' },
  REGISTRATION_OPEN: { variant: 'new', label: 'Open' },
  REGISTRATION_CLOSED: { variant: 'secondary', label: 'Closed' },
  LIVE: { variant: 'live', label: 'Live' },
  IN_PROGRESS: { variant: 'live', label: 'In Progress' },
  COMPLETED: { variant: 'info', label: 'Completed' },
  CANCELLED: { variant: 'error', label: 'Cancelled' },
};

export function TournamentStatusBadge({ status }: TournamentStatusBadgeProps) {
  const config = statusConfig[status] || { variant: 'secondary', label: status };
  
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}
