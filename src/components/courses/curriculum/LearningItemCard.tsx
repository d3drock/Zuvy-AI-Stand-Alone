
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GripVertical, Edit, Trash2, FileText, Video, ClipboardCheck, Code, BookOpen } from 'lucide-react';
import { LearningItem } from './types';
import { cn } from '@/lib/utils';

interface LearningItemCardProps {
  learningItem: LearningItem;
  onDelete: () => void;
  onEdit?: () => void;
  isDragging?: boolean;
  index?: number;
  onDragStart?: (e: React.DragEvent, itemId: string, index: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent, itemId: string, index: number) => void;
  showDropIndicator?: boolean;
  dropPosition?: 'above' | 'below';
}

const LearningItemCard = ({ 
  learningItem, 
  onDelete, 
  onEdit,
  isDragging = false,
  index = 0,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onKeyDown,
  showDropIndicator = false,
  dropPosition = 'above'
}: LearningItemCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'reading': return FileText;
      case 'video': return Video;
      case 'assignment': return ClipboardCheck;
      case 'quiz': return ClipboardCheck;
      case 'coding': return Code;
      default: return BookOpen;
    }
  };

  const IconComponent = getItemIcon(learningItem.type);

  return (
    <div className="relative">
      {/* Drop indicator above */}
      {showDropIndicator && dropPosition === 'above' && (
        <div className="absolute -top-2 left-0 right-0 h-0.5 bg-primary rounded-full z-10 shadow-lg" />
      )}
      
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-card-light hover:bg-primary-light transition-all duration-200 group cursor-grab active:cursor-grabbing",
          isDragging && "opacity-40 scale-95 shadow-lg ring-2 ring-primary/20"
        )}
        draggable={!!onDragStart}
        tabIndex={0}
        role="listitem"
        aria-label={`Learning item: ${learningItem.title}. Press Alt + Arrow keys to reorder, or drag to move within this module.`}
        onDragStart={onDragStart ? (e) => onDragStart(e, learningItem.id, index) : undefined}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver ? (e) => onDragOver(e, index) : undefined}
        onDragLeave={onDragLeave}
        onDrop={onDrop ? (e) => onDrop(e, index) : undefined}
        onKeyDown={onKeyDown ? (e) => onKeyDown(e, learningItem.id, index) : undefined}
      >
        <div 
          className={cn(
            "cursor-grab text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-md hover:bg-primary-light",
            isDragging && "text-primary bg-primary/10 opacity-100"
          )}
          title="Drag to reorder within module"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-md bg-primary-light text-primary">
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <h4 className="font-medium text-lg">{learningItem.title}</h4>
            {learningItem.type === 'live-class' && learningItem.duration && (
              <p className="text-sm text-muted-foreground ml-4">{learningItem.duration} min</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive-dark hover:bg-destructive-light"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Learning Item</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{learningItem.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    onDelete();
                    setDeleteDialogOpen(false);
                  }}
                >
                  Delete Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Drop indicator below */}
      {showDropIndicator && dropPosition === 'below' && (
        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full z-10 shadow-lg" />
      )}
    </div>
  );
};

export default LearningItemCard;
