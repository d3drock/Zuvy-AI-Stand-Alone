import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Batch } from '../students/BatchCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users } from 'lucide-react';

interface BatchSelectorProps {
  batches: Batch[];
  selectedBatchId?: string | null;
  onSelectBatch: (batchId: string) => void;
  isCompact?: boolean;
  isLoading?: boolean;
}

export const BatchSelector = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  isCompact = false,
  isLoading = false
}: BatchSelectorProps) => {
  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-muted text-muted-foreground';
      case 'ongoing':
        return 'bg-success-light text-success-dark';
      case 'completed':
        return 'bg-blue-light text-blue-dark';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // If compact view is requested, show a simple dropdown
  if (isCompact) {
    return (
      <Select value={selectedBatchId || ''} onValueChange={onSelectBatch}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select batch" />
        </SelectTrigger>
        <SelectContent>
          {batches.map(batch => (
            <SelectItem key={batch.id} value={batch.id}>
              {batch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // For expanded view, show batch cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex items-center gap-4 text-sm mt-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <Card className="border-dashed border-muted">
        <CardContent className="p-6 text-center text-muted-foreground">
          No batches available for this course.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {batches.map(batch => (
        <Card 
          key={batch.id} 
          className={`cursor-pointer hover:shadow-lg transition-shadow ${
            selectedBatchId === batch.id ? 'border-primary border-2' : ''
          }`}
          onClick={() => onSelectBatch(batch.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{batch.name}</h3>
              <Badge className={getStatusColor(batch.status)}>
                {batch.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(batch.startDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{batch.studentCount || 0} students</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 