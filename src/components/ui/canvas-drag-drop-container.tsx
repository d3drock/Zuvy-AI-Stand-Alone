'use client'

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useMediaQuery } from '@/hooks/use-media-query';

// Types for the canvas items
export type CanvasItemType = 'module' | 'project' | 'learning-item';

export interface CanvasItem {
  id: string;
  type: CanvasItemType;
  parentId?: string; // For learning items, this would be the module ID
}

interface CanvasDragDropContainerProps {
  children: React.ReactNode;
  items: CanvasItem[];
  onItemsChange: (items: CanvasItem[]) => void;
  className?: string;
  renderDragOverlay?: (activeId: string | null, itemType: CanvasItemType | null) => React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  collisionDetection?: typeof closestCenter;
}

/**
 * CanvasDragDropContainer
 * 
 * A container component that provides drag-and-drop functionality for curriculum items.
 * Handles both module-level and learning-item-level drag operations.
 */
export function CanvasDragDropContainer({
  children,
  items,
  onItemsChange,
  className,
  renderDragOverlay,
  orientation = 'horizontal',
  collisionDetection = closestCenter,
}: CanvasDragDropContainerProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeItemType, setActiveItemType] = React.useState<CanvasItemType | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Use appropriate sensors based on device
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Increase activation distance for touch devices
      activationConstraint: {
        distance: isMobile ? 10 : 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find the correct sorting strategy based on orientation
  const sortingStrategy = orientation === 'horizontal' 
    ? horizontalListSortingStrategy 
    : verticalListSortingStrategy;

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the item type
    const draggedItem = items.find(item => item.id === active.id);
    if (draggedItem) {
      setActiveItemType(draggedItem.type);
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeItem = items.find(item => item.id === active.id);
    const overItem = items.find(item => item.id === over.id);
    
    if (!activeItem || !overItem) return;
    
    // If dragging a learning item over a module or project
    if (activeItem.type === 'learning-item' && 
        (overItem.type === 'module' || overItem.type === 'project')) {
      
      // Update the parentId of the learning item
      const updatedItems = items.map(item => {
        if (item.id === activeItem.id) {
          return { ...item, parentId: overItem.id };
        }
        return item;
      });
      
      onItemsChange(updatedItems);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveItemType(null);
      return;
    }
    
    if (active.id !== over.id) {
      // Find positions in the array
      const activeIndex = items.findIndex(item => item.id === active.id);
      const overIndex = items.findIndex(item => item.id === over.id);
      
      // Update positions using arrayMove helper
      const newItems = arrayMove(items, activeIndex, overIndex);
      onItemsChange(newItems);
    }
    
    setActiveId(null);
    setActiveItemType(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={sortingStrategy}
      >
        <div 
          className={cn(
            "relative",
            orientation === 'horizontal' ? "flex overflow-x-auto" : "flex flex-col",
            className
          )}
          data-orientation={orientation}
          role="region"
          aria-label="Canvas drag drop container"
        >
          {children}
        </div>
      </SortableContext>
      
      {/* Drag Overlay - shows a preview of the dragged item */}
      <DragOverlay adjustScale={true}>
        {activeId && renderDragOverlay ? renderDragOverlay(activeId, activeItemType) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Export types for consumers
export type { DragStartEvent, DragEndEvent, DragOverEvent }; 