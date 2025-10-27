
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface PerformanceWidgetProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  type?: 'number' | 'progress' | 'alert';
}

const PerformanceWidget = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral',
  type = 'number' 
}: PerformanceWidgetProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return type === 'alert' ? 'text-destructive' : 'text-success';
      case 'down':
        return type === 'alert' ? 'text-success' : 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeIcon = () => {
    if (type === 'alert') {
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    }
    return null;
  };

  return (
    <Card className="shadow-4dp">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {getTypeIcon()}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        {type === 'progress' && (
          <div className="mt-2">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: value }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceWidget;
