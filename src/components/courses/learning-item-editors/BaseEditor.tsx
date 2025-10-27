import React from 'react';
import { Button } from '@/components/ui/button';
import { LearningItemType } from '@/components/ui/learning-item-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface BaseEditorProps {
  title: string;
  type: LearningItemType;
  mode: 'create' | 'edit';
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  tabs?: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  footerContent?: React.ReactNode;
  description?: string;
  className?: string;
  hideCancel?: boolean;
}

/**
 * BaseEditor
 * 
 * A base component for all learning item editors.
 * Provides a consistent layout and behavior for editing different types of learning items.
 */
export function BaseEditor({
  title,
  type,
  mode,
  onSave,
  onCancel,
  children,
  tabs,
  footerContent,
  description,
  className,
  hideCancel = false,
}: BaseEditorProps) {
  // Format the title based on the mode and type
  const formattedTitle = `${mode === 'create' ? 'Create' : 'Edit'} ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}`;
  
  // If tabs are provided, render them
  if (tabs && tabs.length > 0) {
    return (
      <div className="flex flex-col h-full">
        {description && (
          <div className="mb-6">
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        )}
        
        <div className="flex-1">
          <Tabs defaultValue={tabs[0].id} className="w-full h-full flex flex-col">
            <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="pt-4 h-full">
                  {tab.content}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        
        <div className="flex justify-between mt-auto pt-6 border-t bg-background sticky bottom-0">
          {footerContent || (
            <>
              {!hideCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
              <Button onClick={onSave} className={hideCancel ? 'ml-auto' : ''}>
                {mode === 'create' ? 'Create' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // Otherwise, render without card wrapper
  return (
    <div className="flex flex-col h-full">
      {description && (
        <div className="mb-6">
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      <div className="flex justify-between mt-auto pt-6 border-t bg-background sticky bottom-0">
        {footerContent || (
          <>
            {!hideCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
            <Button onClick={onSave} className={hideCancel ? 'ml-auto' : ''}>
              {mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 