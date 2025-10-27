'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ManageTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageTopicsModal = ({ isOpen, onClose }: ManageTopicsModalProps) => {
  const [topics, setTopics] = useState<string[]>([
    'JavaScript Basics',
    'React Fundamentals', 
    'Node.js',
    'Algorithms',
    'Data Structures',
    'CSS Layout',
    'TypeScript',
    'Database Concepts',
    'System Design',
    'Web APIs',
    'Testing',
    'Performance Optimization'
  ]);

  const [newTopic, setNewTopic] = useState('');
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics(prev => [...prev, newTopic.trim()]);
      setNewTopic('');
      setIsAddingTopic(false);
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(prev => prev.filter(topic => topic !== topicToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTopic();
    } else if (e.key === 'Escape') {
      setNewTopic('');
      setIsAddingTopic(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Manage Topics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              Questions can be made for these topics in the content bank
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border border-dashed border-muted-foreground/30 rounded-lg">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="group relative px-3 py-1 pr-6 hover:bg-destructive-light hover:text-destructive-dark transition-colors cursor-pointer"
                >
                  <span>{topic}</span>
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {topics.length === 0 && (
                <div className="w-full text-center py-8 text-muted-foreground">
                  No topics added yet. Create your first topic below.
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isAddingTopic ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter topic name..."
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    onClick={handleAddTopic}
                    disabled={!newTopic.trim() || topics.includes(newTopic.trim())}
                    size="sm"
                  >
                    Add
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setNewTopic('');
                      setIsAddingTopic(false);
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingTopic(true)}
                  className="text-primary hover:text-primary-dark"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Topic
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={onClose} className="bg-primary hover:bg-primary-dark">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTopicsModal;