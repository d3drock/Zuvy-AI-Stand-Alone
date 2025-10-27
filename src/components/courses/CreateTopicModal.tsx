
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicCreated: (topic: string) => void;
}

const CreateTopicModal = ({ isOpen, onClose, onTopicCreated }: CreateTopicModalProps) => {
  const [topicData, setTopicData] = useState({
    name: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setTopicData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    if (topicData.name.trim()) {
      console.log('Creating new topic:', topicData);
      onTopicCreated(topicData.name);
      setTopicData({ name: '', description: '' });
    }
  };

  const handleClose = () => {
    setTopicData({ name: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Create New Topic</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic-name">Topic Name *</Label>
            <Input
              id="topic-name"
              placeholder="e.g., Advanced React Patterns"
              value={topicData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic-description">Description (Optional)</Label>
            <Textarea
              id="topic-description"
              placeholder="Brief description of this topic..."
              value={topicData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!topicData.name.trim()}
            className="bg-primary hover:bg-primary-dark"
          >
            Create Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicModal;
