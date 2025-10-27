import * as React from 'react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  handleClassName?: string;
  isDragging?: boolean;
  disableSorting?: boolean;
  data?: Record<string, unknown>;
}

/**
 * SortableItem
 * 
 * A wrapper component that makes its children sortable via drag and drop.
 * Works with the CanvasDragDropContainer component.
 */
export function SortableItem({
  id,
  children,
  className,
  handleClassName,
  isDragging: externalIsDragging,
  disableSorting = false,
  data
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: internalIsDragging
  } = useSortable({ 
    id, 
    disabled: disableSorting,
    data
  });

  // Allow for external control of isDragging state if needed
  const isDragging = externalIsDragging !== undefined ? externalIsDragging : internalIsDragging;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative touch-none", isDragging && "z-10", className)}
      {...attributes}
    >
      {React.Children.map(children, child => {
        // Check if the child is a React element and has a data-drag-handle attribute
        if (React.isValidElement(child) && child.props['data-drag-handle']) {
          // Clone the element and add the drag listeners
          return React.cloneElement(child, {
            ...child.props,
            ...listeners,
            className: cn(child.props.className, handleClassName, 'cursor-grab', isDragging && 'cursor-grabbing')
          });
        }
        
        // Otherwise, return the child as is
        return child;
      })}
    </div>
  );
}

/**
 * DragHandle
 * 
 * A component that can be used as a drag handle inside a SortableItem.
 */
interface DragHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function DragHandle({ children, className, ...props }: DragHandleProps) {
  return (
    <div 
      className={cn("touch-none", className)}
      data-drag-handle
      role="button"
      aria-label="Drag handle"
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
} 