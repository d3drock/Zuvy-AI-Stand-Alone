'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Target, Brain, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}

function MetricCard({ title, value, subtitle, trend, icon, color = 'primary' }: MetricCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <Card className="p-6 hover:shadow-8dp transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend.direction === 'up' ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span
              className={cn(
                'text-body2 font-semibold',
                trend.direction === 'up' ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.value}%
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-body2 text-muted-foreground mb-1">{title}</p>
        <p className="text-h5 font-semibold text-foreground mb-1">{value}</p>
        {subtitle && <p className="text-body2 text-muted-foreground">{subtitle}</p>}
      </div>
    </Card>
  );
}

interface PerformanceMetricsProps {
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  studentsNeedingHelp: number;
  averageProficiency: string;
  topPerformers: number;
  trends?: {
    students?: { value: number; direction: 'up' | 'down' };
    score?: { value: number; direction: 'up' | 'down' };
    completion?: { value: number; direction: 'up' | 'down' };
  };
}

export function PerformanceMetrics({
  totalStudents,
  averageScore,
  completionRate,
  studentsNeedingHelp,
  averageProficiency,
  topPerformers,
  trends = {},
}: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Students"
        value={totalStudents}
        subtitle="Active learners"
        icon={<Users className="h-5 w-5" />}
        color="primary"
        trend={trends.students}
      />

      <MetricCard
        title="Average Score"
        value={`${averageScore}%`}
        subtitle="Overall accuracy"
        icon={<Target className="h-5 w-5" />}
        color="success"
        trend={trends.score}
      />

      <MetricCard
        title="Completion Rate"
        value={`${completionRate}%`}
        subtitle="Finished assessments"
        icon={<TrendingUp className="h-5 w-5" />}
        color="primary"
        trend={trends.completion}
      />

      <MetricCard
        title="Need Intervention"
        value={studentsNeedingHelp}
        subtitle="Requires attention"
        icon={<AlertCircle className="h-5 w-5" />}
        color="warning"
      />
    </div>
  );
}

interface ProficiencyDistributionProps {
  basic: number;
  intermediate: number;
  advanced: number;
}

export function ProficiencyDistribution({
  basic,
  intermediate,
  advanced,
}: ProficiencyDistributionProps) {
  const total = basic + intermediate + advanced;
  const basicPercent = total > 0 ? Math.round((basic / total) * 100) : 0;
  const intermediatePercent = total > 0 ? Math.round((intermediate / total) * 100) : 0;
  const advancedPercent = total > 0 ? Math.round((advanced / total) * 100) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-body1 font-semibold">Proficiency Distribution</h3>
          <p className="text-body2 text-muted-foreground">Student skill levels</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bars */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">Advanced</Badge>
              <span className="text-body2 text-muted-foreground">{advanced} students</span>
            </div>
            <span className="text-body2 font-semibold">{advancedPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${advancedPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500">Intermediate</Badge>
              <span className="text-body2 text-muted-foreground">{intermediate} students</span>
            </div>
            <span className="text-body2 font-semibold">{intermediatePercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${intermediatePercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500">Basic</Badge>
              <span className="text-body2 text-muted-foreground">{basic} students</span>
            </div>
            <span className="text-body2 font-semibold">{basicPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all"
              style={{ width: `${basicPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
