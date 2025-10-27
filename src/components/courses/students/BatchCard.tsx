import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Calendar, Users, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

export interface Batch {
  id: string;
  name: string;
  status: 'Not Started' | 'Ongoing' | 'Completed';
  startDate: string;
  endDate?: string;
  studentCount: number;
}

interface BatchCardProps {
  batch: Batch;
  onView: (batchId: string) => void;
  onEdit: (batchId: string) => void;
  onDelete: (batchId: string) => void;
}

const BatchCard = ({ batch, onView, onEdit, onDelete }: BatchCardProps) => {
  // Get status badge variant based on batch status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Not Started':
        return 'outline';
      case 'Ongoing':
        return 'default';
      case 'Completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{batch.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(batch.status)}>
              {batch.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(batch.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Students
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(batch.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Batch
                </DropdownMenuItem>
                {batch.status === 'Not Started' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(batch.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Batch
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Started: {formatDate(batch.startDate)}</span>
          </div>
          {batch.endDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Ends: {formatDate(batch.endDate)}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span>
              <span className="font-medium">{batch.studentCount}</span> students
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onView(batch.id)}
        >
          View Students
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BatchCard; 