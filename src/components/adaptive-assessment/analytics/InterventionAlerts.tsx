'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, UserX, Eye, Mail, MessageCircle } from 'lucide-react';
import { MentorInsight } from '@/types/adaptive-assessment';
import { cn } from '@/lib/utils';

interface InterventionAlertsProps {
  alerts: MentorInsight[];
  onViewStudent?: (studentId: string) => void;
  onContactStudent?: (studentId: string) => void;
}

export function InterventionAlerts({
  alerts,
  onViewStudent,
  onContactStudent,
}: InterventionAlertsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'struggling':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'excelling':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'abandoned':
        return <UserX className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'struggling':
        return 'border-l-warning bg-warning/5';
      case 'excelling':
        return 'border-l-success bg-success/5';
      case 'abandoned':
        return 'border-l-destructive bg-destructive/5';
      default:
        return 'border-l-muted';
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'struggling':
        return <Badge className="bg-warning">Needs Help</Badge>;
      case 'excelling':
        return <Badge className="bg-success">High Performer</Badge>;
      case 'abandoned':
        return <Badge className="bg-destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">Review</Badge>;
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'advanced':
        return 'text-success';
      case 'intermediate':
        return 'text-primary';
      case 'basic':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  // Group alerts by type
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!acc[alert.alertType]) {
      acc[alert.alertType] = [];
    }
    acc[alert.alertType].push(alert);
    return acc;
  }, {} as Record<string, MentorInsight[]>);

  const alertTypes = ['struggling', 'abandoned', 'excelling', 'needs-review'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-warning" />
            <div>
              <p className="text-body2 text-muted-foreground">Struggling</p>
              <p className="text-h5 font-semibold">
                {groupedAlerts['struggling']?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="flex items-center gap-3">
            <UserX className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-body2 text-muted-foreground">Inactive</p>
              <p className="text-h5 font-semibold">
                {groupedAlerts['abandoned']?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-success" />
            <div>
              <p className="text-body2 text-muted-foreground">Excelling</p>
              <p className="text-h5 font-semibold">
                {groupedAlerts['excelling']?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <p className="text-body2 text-muted-foreground">Total Alerts</p>
              <p className="text-h5 font-semibold">{alerts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alert List */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-warning/10 text-warning">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-body1 font-semibold">
              Student Intervention Alerts
            </h3>
            <p className="text-body2 text-muted-foreground">
              Students requiring mentor attention
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-body1 text-muted-foreground">
                No intervention alerts at this time
              </p>
              <p className="text-body2 text-muted-foreground mt-1">
                All students are performing well
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <Card
                key={alert.studentId}
                className={cn(
                  'p-4 border-l-4 transition-shadow hover:shadow-4dp',
                  getAlertColor(alert.alertType)
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Alert Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getAlertIcon(alert.alertType)}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-body1">{alert.studentName}</h4>
                        {getAlertBadge(alert.alertType)}
                        <Badge
                          variant="outline"
                          className={cn('capitalize', getProficiencyColor(alert.proficiencyLevel))}
                        >
                          {alert.proficiencyLevel}
                        </Badge>
                      </div>

                      <p className="text-body2 text-foreground mb-3">{alert.message}</p>

                      <div className="flex items-center gap-4 text-body2 text-muted-foreground mb-3">
                        <span>Accuracy: {alert.recentAccuracy}%</span>
                        <span>•</span>
                        <span>Assessments: {alert.assessmentsCompleted}</span>
                        <span>•</span>
                        <span>Last seen: {formatDate(alert.lastActivityDate)}</span>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-body2">
                          <span className="font-semibold text-foreground">
                            Recommended Action:
                          </span>{' '}
                          <span className="text-muted-foreground">
                            {alert.recommendedAction}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewStudent?.(alert.studentId)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onContactStudent?.(alert.studentId)}
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
