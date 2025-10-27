
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, BookOpen, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentItem } from './types';

interface ProjectCardProps {
  item: ContentItem;
  index: number;
  onDelete: (itemId: string) => void;
  getContentIndex: (index: number) => string;
  getDifficultyColor: (difficulty: string) => string;
  onEditProject?: (projectId: string) => void;
  isDragging?: boolean;
}

const ProjectCard = ({ 
  item, 
  index, 
  onDelete, 
  getContentIndex, 
  getDifficultyColor,
  onEditProject,
  isDragging = false
}: ProjectCardProps) => {
  return (
    <Card className={cn("shadow-4dp transition-all duration-200", isDragging && "shadow-lg ring-2 ring-primary/20")}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div 
            className={cn(
              "cursor-grab text-muted-foreground hover:text-primary transition-colors duration-200 p-1 rounded-md hover:bg-primary-light",
              isDragging && "text-primary bg-primary/10"
            )}
            title="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="p-2 rounded-md bg-warning-light text-warning">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="font-body font-semibold text-lg">
                {getContentIndex(index)}: {item.title}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    // Only allow editing for Project 1: Portfolio Website
                    if (item.title === 'Portfolio Website' && onEditProject) {
                      onEditProject(item.id);
                    } else {
                      console.log('Editing not available for this project');
                    }
                  }}
                  disabled={item.title !== 'Portfolio Website'}
                  className={item.title !== 'Portfolio Website' ? 'opacity-50 cursor-not-allowed' : ''}
                  title={item.title === 'Portfolio Website' ? 'Edit project' : 'Editing not available for this project'}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="text-destructive hover:text-destructive-dark hover:bg-destructive-light"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
            {item.duration && (
              <p className="text-xs text-muted-foreground">Duration: {item.duration}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
