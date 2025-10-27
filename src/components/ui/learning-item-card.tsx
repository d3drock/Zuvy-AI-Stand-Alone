'use client'

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GripVertical, 
  Edit, 
  Trash2, 
  FileText, 
  Video, 
  CheckSquare, 
  Code, 
  Clock, 
  MessageSquare,
  VideoIcon,
  CalendarClock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SortableItem, DragHandle } from './sortable-item';
import { Input } from './input';

export type LearningItemType = 
  | 'article' 
  | 'video' 
  | 'quiz' 
  | 'assignment' 
  | 'coding' 
  | 'assessment' 
  | 'feedback' 
  | 'live-class';

// Map of item types to their respective icons
const itemTypeIcons: Record<LearningItemType, React.ReactNode> = {
  'article': <FileText className="h-4 w-4" />,
  'video': <Video className="h-4 w-4" />,
  'quiz': <CheckSquare className="h-4 w-4" />,
  'assignment': <FileText className="h-4 w-4" />,
  'coding': <Code className="h-4 w-4" />,
  'assessment': <Clock className="h-4 w-4" />,
  'feedback': <MessageSquare className="h-4 w-4" />,
  'live-class': <VideoIcon className="h-4 w-4" />
};

// Map of item types to their display names
const itemTypeNames: Record<LearningItemType, string> = {
  'article': 'Article',
  'video': 'Video',
  'quiz': 'Quiz',
  'assignment': 'Assignment',
  'coding': 'Coding Problem',
  'assessment': 'Assessment',
  'feedback': 'Feedback Form',
  'live-class': 'Live Class'
};

export interface LearningItemCardProps {
  id: string;
  title: string;
  type: LearningItemType;
  contextInfo?: string; // Start date, due date, duration, etc.
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onTitleChange?: (newTitle: string) => void;
  className?: string;
  disableDrag?: boolean;
  isEditingTitle?: boolean;
  moduleId?: string;
}

/**
 * LearningItemCard
 * 
 * A card component for displaying learning items in the curriculum canvas.
 * Supports inline title editing, drag-and-drop, and contextual information.
 */
export function LearningItemCard({
  id,
  title,
  type,
  contextInfo,
  description,
  onEdit,
  onDelete,
  onTitleChange,
  className,
  disableDrag = false,
  isEditingTitle: externalIsEditingTitle,
  moduleId
}: LearningItemCardProps) {
  // State for managing inline editing
  const [internalIsEditingTitle, setInternalIsEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(title);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  // Use external state if provided, otherwise use internal state
  const isEditingTitle = externalIsEditingTitle !== undefined 
    ? externalIsEditingTitle 
    : internalIsEditingTitle;

  // Handle double click on title to edit
  const handleTitleDoubleClick = () => {
    if (onTitleChange) {
      setInternalIsEditingTitle(true);
    }
  };

  // Handle title input blur to save changes
  const handleTitleBlur = () => {
    if (onTitleChange && titleValue !== title) {
      onTitleChange(titleValue);
    }
    setInternalIsEditingTitle(false);
  };

  // Handle title input key press to save on Enter
  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onTitleChange && titleValue !== title) {
        onTitleChange(titleValue);
      }
      setInternalIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitleValue(title); // Reset to original value
      setInternalIsEditingTitle(false);
    }
  };

  // Focus the title input when editing starts
  React.useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  // Icon for the item type
  const itemIcon = itemTypeIcons[type] || <FileText className="h-4 w-4" />;
  const itemTypeName = itemTypeNames[type] || 'Item';

  // Generate contextual icon based on item type
  const getContextIcon = () => {
    if (type === 'live-class' || type === 'assessment') {
      return <CalendarClock className="h-3 w-3 mr-1 opacity-70" />;
    }
    if (type === 'assignment') {
      return <Clock className="h-3 w-3 mr-1 opacity-70" />;
    }
    if (type === 'video') {
      return <Clock className="h-3 w-3 mr-1 opacity-70" />;
    }
    return null;
  };

  return (
    <SortableItem 
      id={id} 
      className={className}
      disableSorting={disableDrag}
      data={{ type: 'learning-item', moduleId }}
    >
      <Card className="border overflow-hidden">
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Title with inline editing */}
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 flex items-center gap-1">
                  {itemIcon}
                  <span>{itemTypeName}</span>
                </Badge>
              </div>

              {isEditingTitle ? (
                <Input
                  ref={titleInputRef}
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyPress}
                  className="font-medium text-sm h-7 py-1"
                />
              ) : (
                <h3 
                  className="font-medium text-sm truncate mb-1 cursor-text" 
                  onDoubleClick={handleTitleDoubleClick}
                  title={title}
                >
                  {title}
                </h3>
              )}

              {/* Context Info (Due date, duration, etc.) */}
              {contextInfo && (
                <div className="flex items-center text-xs text-muted-foreground">
                  {getContextIcon()}
                  <span>{contextInfo}</span>
                </div>
              )}

              {/* Description (optional) */}
              {description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center ml-2">
              {/* Drag Handle */}
              <DragHandle className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-accent mr-1">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
              </DragHandle>
              
              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
                    <Edit className="h-3.5 w-3.5" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={onDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                  {onTitleChange && (
                    <DropdownMenuItem onClick={() => setInternalIsEditingTitle(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    </SortableItem>
  );
} 