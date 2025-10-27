'use client'

import { useState } from 'react';
import { 
  FocusPanel, 
  FocusPanelSection, 
  FocusPanelActions 
} from '../ui/focus-panel';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';

export function FocusPanelDemo() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Article Title');
  const [content, setContent] = useState('This is the article content...');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Focus Panel Demo</h1>
      
      <Button onClick={() => setOpen(true)}>
        Open Focus Panel
      </Button>
      
      <FocusPanel 
        open={open} 
        onOpenChange={setOpen} 
        title="Edit Article"
        description="Make changes to the article content and metadata"
        footer={
          <FocusPanelActions>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Save Changes
            </Button>
          </FocusPanelActions>
        }
      >
        <Tabs defaultValue="content">
          <TabsList className="mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <FocusPanelSection title="Article Details">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </FocusPanelSection>
          </TabsContent>
          
          <TabsContent value="settings">
            <FocusPanelSection title="Publishing Settings">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedReadTime">Estimated Read Time (minutes)</Label>
                  <Input 
                    id="estimatedReadTime" 
                    type="number" 
                    min="1"
                    defaultValue="5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    placeholder="Enter tags separated by commas"
                    defaultValue="beginner, html, tutorial"
                  />
                </div>
              </div>
            </FocusPanelSection>
          </TabsContent>
        </Tabs>
      </FocusPanel>
    </div>
  );
} 