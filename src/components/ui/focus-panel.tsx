import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FocusPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const widthClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-full'
};

/**
 * FocusPanel Component
 * 
 * A slide-in panel from the right side of the screen for detailed content editing.
 * Built on top of the Sheet component with optimizations for editing workflow.
 */
export function FocusPanel({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width = 'lg',
  className,
  contentClassName,
  headerClassName,
  footerClassName,
}: FocusPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={cn(
          "p-0 flex flex-col",
          widthClasses[width],
          "border-l border-border",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className={cn("p-6 border-b", headerClassName)}>
            <div className="pr-8">
              <SheetTitle>{title}</SheetTitle>
              {description && (
                <SheetDescription>{description}</SheetDescription>
              )}
            </div>
          </SheetHeader>
          
          {/* Content with ScrollArea for overflow */}
          <ScrollArea className={cn("flex-1", contentClassName)}>
            <div className="p-6">
              {children}
            </div>
          </ScrollArea>
          
          {/* Footer */}
          {footer && (
            <SheetFooter className={cn("p-6 border-t mt-auto", footerClassName)}>
              {footer}
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * FocusPanelTabs Component
 * 
 * A container for tabs within the FocusPanel.
 */
interface FocusPanelTabsProps {
  children: React.ReactNode;
  className?: string;
}

export function FocusPanelTabs({ children, className }: FocusPanelTabsProps) {
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {children}
    </div>
  );
}

/**
 * FocusPanelSection Component
 * 
 * A section within the FocusPanel for organizing content.
 */
interface FocusPanelSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FocusPanelSection({
  title,
  description,
  children,
  className,
}: FocusPanelSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * FocusPanelActions Component
 * 
 * A container for action buttons within the FocusPanel.
 */
interface FocusPanelActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FocusPanelActions({ children, className }: FocusPanelActionsProps) {
  return (
    <div className={cn("flex items-center justify-end space-x-2", className)}>
      {children}
    </div>
  );
} 