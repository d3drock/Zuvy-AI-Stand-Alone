
'use client'

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, GripVertical, FolderOpen, Edit, Trash2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentItem, LearningItem } from './types';
import LearningItemCard from './LearningItemCard';
import ContentTypeSelector from './ContentTypeSelector';
import { LearningItemType } from '@/components/ui/learning-item-card';


interface ModuleCardProps {
  item: ContentItem;
  index: number;
  onToggle: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  onDeleteLearningItem: (itemId: string, learningItemId: string) => void;
  onToggleAddContent: (itemId: string) => void;
  getContentIndex: (index: number) => string;
  onAddItem?: (type: string) => void;
  onEditItem?: (itemId: string, type: string) => void;
  onDropItem?: (moduleId: string, item: any) => void;
  onReorderLearningItems?: (moduleId: string, items: LearningItem[]) => void;
  onEditModule?: (moduleId: string) => void;
  onNavigateToModule?: (moduleId: string, type: 'module' | 'project') => void;
  isDragging?: boolean;
}

const ModuleCard = ({
  item,
  index,
  onToggle,
  onDelete,
  onDeleteLearningItem,
  onToggleAddContent,
  getContentIndex,
  onAddItem,
  onEditItem,
  onDropItem,
  onReorderLearningItems,
  onEditModule,
  onNavigateToModule,
  isDragging = false
}: ModuleCardProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Ref for auto-scroll functionality
  const contentTypeSelectorRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll handler for Add Content
  const handleToggleAddContent = () => {
    onToggleAddContent(item.id);
    // If we're opening the content selector, scroll to it
    if (!item.showAddContent) {
      setTimeout(() => {
        contentTypeSelectorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  };
  
  // Learning item drag and drop states
  const [draggedLearningItemId, setDraggedLearningItemId] = useState<string | null>(null);
  const [dragOverLearningIndex, setDragOverLearningIndex] = useState<number | null>(null);
  const [isLearningItemDragging, setIsLearningItemDragging] = useState(false);

  // Map content type to learning item type
  const mapContentTypeToLearningItemType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'article': 'article',
      'video': 'video',
      'quiz': 'quiz',
      'assignment': 'assignment',
      'coding-problem': 'coding',
      'live-class': 'live-class',
      'feedback-form': 'feedback',
      'assessment': 'assessment'
    };
    return typeMap[type] || type;
  };

  const handleContentTypeSelect = (type: string) => {
    // Close the content selector
    onToggleAddContent(item.id);
    
    // Call the onAddItem prop if provided
    if (onAddItem) {
      const learningItemType = mapContentTypeToLearningItemType(type);
      onAddItem(learningItemType);
    }
  };

  const handleEditLearningItem = (learningItem: LearningItem) => {
    if (onEditItem) {
      onEditItem(learningItem.id, learningItem.type);
    }
  };

  // Handle card click for navigation
  const handleCardClick = () => {
    if (onNavigateToModule) {
      onNavigateToModule(item.id, item.type);
    }
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  // Handle drag leave event
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      // Get the dropped item data
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const droppedItem = JSON.parse(jsonData);
        
        // Call the onDropItem prop if provided
        if (onDropItem) {
          onDropItem(item.id, droppedItem);
        }
      }
    } catch (error) {
      console.error('Error parsing dropped item:', error);
    }
  };

  // Learning item drag and drop handlers
  const handleLearningItemDragStart = (e: React.DragEvent, itemId: string, index: number) => {
    setDraggedLearningItemId(itemId);
    setIsLearningItemDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    
    // Set drag image to be slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    }
  };

  const handleLearningItemDragEnd = () => {
    setDraggedLearningItemId(null);
    setDragOverLearningIndex(null);
    setIsLearningItemDragging(false);
  };

  const handleLearningItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedLearningItemId || !item.items) return;
    
    const draggedIndex = item.items.findIndex(learningItem => learningItem.id === draggedLearningItemId);
    if (draggedIndex === -1 || draggedIndex === index) return;
    
    // Get the mouse position relative to the element
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const midpoint = rect.height / 2;
    
    // Determine if we're in the top or bottom half
    let targetIndex = index;
    if (draggedIndex > index) {
      // Dragging up - insert before if in top half, after if in bottom half
      targetIndex = y < midpoint ? index : index + 1;
    } else {
      // Dragging down - insert before if in top half, after if in bottom half  
      targetIndex = y < midpoint ? index - 1 : index;
    }
    
    if (targetIndex !== dragOverLearningIndex && targetIndex >= 0 && targetIndex <= item.items.length) {
      setDragOverLearningIndex(targetIndex);
    }
  };

  const handleLearningItemDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the learning items container entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverLearningIndex(null);
    }
  };

  const handleLearningItemDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedLearningItemId || dragOverLearningIndex === null || !item.items) return;
    
    const draggedIndex = item.items.findIndex(learningItem => learningItem.id === draggedLearningItemId);
    if (draggedIndex === -1) return;
    
    // Use the dragOverLearningIndex for more precise positioning
    let targetIndex = dragOverLearningIndex;
    
    // Adjust for the removal of the dragged item
    if (targetIndex > draggedIndex) {
      targetIndex--;
    }
    
    if (targetIndex === draggedIndex) return;
    
    // Create new array with reordered items
    const newItems = [...item.items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    // Call the reorder callback
    if (onReorderLearningItems) {
      onReorderLearningItems(item.id, newItems);
    }
    
    setDragOverLearningIndex(null);
  };

  // Keyboard support for learning item reordering
  const handleLearningItemKeyDown = (e: React.KeyboardEvent, itemId: string, index: number) => {
    if (!item.items) return;
    
    if (e.key === 'ArrowUp' && e.altKey && index > 0) {
      e.preventDefault();
      const newItems = [...item.items];
      const [learningItem] = newItems.splice(index, 1);
      newItems.splice(index - 1, 0, learningItem);
      
      if (onReorderLearningItems) {
        onReorderLearningItems(item.id, newItems);
      }
    } else if (e.key === 'ArrowDown' && e.altKey && index < item.items.length - 1) {
      e.preventDefault();
      const newItems = [...item.items];
      const [learningItem] = newItems.splice(index, 1);
      newItems.splice(index + 1, 0, learningItem);
      
      if (onReorderLearningItems) {
        onReorderLearningItems(item.id, newItems);
      }
    }
  };

  return (
    <Card
      className={cn("shadow-4dp transition-all duration-200 cursor-pointer hover:shadow-lg", isDragging && "shadow-lg ring-2 ring-primary/20")}
      onClick={handleCardClick}
    >
      <Collapsible open={item.isExpanded} onOpenChange={() => onToggle(item.id)}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "cursor-grab text-muted-foreground hover:text-primary transition-colors duration-200 p-1 rounded-md hover:bg-primary-light",
                isDragging && "text-primary bg-primary/10"
              )}
              title="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Main content area - clickable for navigation */}
            <div className="flex-1 flex items-center justify-between hover:bg-primary-light p-2 rounded-md transition-colors">
              <div className="text-left flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary-light text-primary">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-body font-semibold text-lg">
                    {getContentIndex(index)}: {item.title}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                    {item.isExpanded && item.items && item.items.length > 0 && (
                      <span className="ml-2 text-xs">
                        • Drag learning items to reorder within this module
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditModule) {
                      onEditModule(item.id);
                    }
                  }}
                  title={`Edit ${item.type} details`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive-dark hover:bg-destructive-light"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete {item.type === 'module' ? 'Module' : 'Project'}</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{item.title}"? This action cannot be undone and will remove all learning items within this {item.type}.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          onDelete(item.id);
                          setDeleteDialogOpen(false);
                        }}
                      >
                        Delete {item.type === 'module' ? 'Module' : 'Project'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Expand/Collapse button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(item.id);
                  }}
                  title={item.isExpanded ? 'Collapse' : 'Expand'}
                >
                  <ChevronDown className={cn(
                    "h-5 w-5 transition-transform",
                    item.isExpanded && "rotate-180"
                  )} />
                </Button>
              </div>
            </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent 
            className={cn(
              "pt-0 transition-colors",
              isDragOver && "bg-muted/50 rounded-md"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div 
                className="space-y-4"
                onDragLeave={handleLearningItemDragLeave}
              >
                {/* Drop indicator for very top of learning items */}
                {dragOverLearningIndex === 0 && draggedLearningItemId && item.items && item.items.findIndex(li => li.id === draggedLearningItemId) !== 0 && (
                  <div className="h-0.5 bg-primary rounded-full shadow-lg mb-2" />
                )}
                
                {item.items?.slice(0, item.isExpanded ? (item.items.length > 10 ? 10 : item.items.length) : item.items.length).map((learningItem, learningItemIndex) => {
                  const showDropIndicator = dragOverLearningIndex === learningItemIndex && draggedLearningItemId && draggedLearningItemId !== learningItem.id;
                  const showDropIndicatorBelow = dragOverLearningIndex === learningItemIndex + 1 && draggedLearningItemId && draggedLearningItemId !== learningItem.id;
                  
                  return (
                    <div key={learningItem.id} className="relative">
                      <LearningItemCard
                        learningItem={learningItem}
                        index={learningItemIndex}
                        onDelete={() => onDeleteLearningItem(item.id, learningItem.id)}
                        onEdit={() => handleEditLearningItem(learningItem)}
                        isDragging={draggedLearningItemId === learningItem.id}
                        onDragStart={handleLearningItemDragStart}
                        onDragEnd={handleLearningItemDragEnd}
                        onDragOver={handleLearningItemDragOver}
                        onDrop={handleLearningItemDrop}
                        onKeyDown={handleLearningItemKeyDown}
                        showDropIndicator={showDropIndicator || showDropIndicatorBelow}
                        dropPosition={showDropIndicator ? 'above' : 'below'}
                      />
                    </div>
                  );
                })}
                
                {/* Drop indicator for very bottom of learning items */}
                {item.items && dragOverLearningIndex === item.items.length && draggedLearningItemId && (
                  <div className="h-0.5 bg-primary rounded-full shadow-lg mt-2" />
                )}
              </div>
              
              {item.items && item.items.length > 10 && item.isExpanded && (
                <Button 
                  variant="ghost" 
                  className="w-full mt-2"
                  onClick={() => {/* Show all logic */}}
                >
                  Show All {item.items.length} Items
                </Button>
              )}

              {/* Add Content Section */}
              {item.showAddContent ? (
                <div ref={contentTypeSelectorRef}>
                  <ContentTypeSelector 
                    onClose={() => onToggleAddContent(item.id)}
                    onSelect={(type) => handleContentTypeSelect(type)}
                  />
                </div>
              ) : (
                <Button
                  onClick={handleToggleAddContent}
                  variant="outline"
                  size="default"
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ModuleCard;
