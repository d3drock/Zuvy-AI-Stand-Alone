
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, FolderOpen, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CounterInput } from '@/components/ui/counter-input';




interface ContentItem {
  id: string;
  type: 'module' | 'project';
  title: string;
  description: string;
  duration: number; // duration in weeks
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

interface NewItemData {
  type: 'module' | 'project';
  title: string;
  description: string;
  duration: number; // duration in weeks
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

interface CurriculumTabProps {
  courseId: string;
}

const CurriculumTab = ({ courseId }: CurriculumTabProps) => {
  const router = useRouter();
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'module',
      title: 'Introduction to Web Development',
      description: 'Fundamentals of HTML, CSS, and JavaScript',
      duration: 2
    },
    {
      id: '2',
      type: 'module',
      title: 'Advanced JavaScript',
      description: 'Deep dive into ES6+, async programming, and modern JavaScript',
      duration: 3
    },
    {
      id: '3',
      type: 'project',
      title: 'Portfolio Website',
      description: 'Build a responsive personal portfolio using HTML, CSS, and JavaScript',
      duration: 1,
      difficulty: 'Easy' as const
    },
    {
      id: '4',
      type: 'module',
      title: 'React Fundamentals',
      description: 'Learn React components, state management, and hooks',
      duration: 3
    },
    {
      id: '5',
      type: 'project',
      title: 'E-commerce Application',
      description: 'Full-stack e-commerce app with React, Node.js, and MongoDB',
      duration: 3,
      difficulty: 'Hard' as const
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [newItemData, setNewItemData] = useState<NewItemData>({
    type: 'module',
    title: '',
    description: '',
    duration: 1,
    difficulty: 'Easy'
  });

  const [editItemData, setEditItemData] = useState<NewItemData>({
    type: 'module',
    title: '',
    description: '',
    duration: 1,
    difficulty: 'Easy'
  });

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-light text-success-dark border-success';
      case 'Medium': return 'bg-warning-light text-warning-dark border-warning';
      case 'Hard': return 'bg-destructive-light text-destructive-dark border-destructive';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getContentIndex = (index: number) => {
    const moduleCount = contentItems.slice(0, index + 1).filter(item => item.type === 'module').length;
    const projectCount = contentItems.slice(0, index + 1).filter(item => item.type === 'project').length;

    if (contentItems[index].type === 'module') {
      return `Module ${moduleCount}`;
    } else {
      return `Project ${projectCount}`;
    }
  };

  const handleAddItem = () => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: newItemData.type,
      title: newItemData.title,
      description: newItemData.description,
      duration: newItemData.duration,
      ...(newItemData.type === 'project' ? { difficulty: newItemData.difficulty } : {})
    };

    setContentItems(prev => [...prev, newItem]);
    setNewItemData({
      type: 'module',
      title: '',
      description: '',
      duration: 1,
      difficulty: 'Easy'
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setContentItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleEditItem = (itemId: string) => {
    const item = contentItems.find(item => item.id === itemId);
    if (!item) return;
    
    // Set up edit modal with current item data
    setEditingItem(item);
    setEditItemData({
      type: item.type,
      title: item.title,
      description: item.description,
      duration: item.duration,
      difficulty: item.difficulty || 'Easy'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const updatedItem: ContentItem = {
      ...editingItem,
      type: editItemData.type,
      title: editItemData.title,
      description: editItemData.description,
      duration: editItemData.duration,
      ...(editItemData.type === 'project' ? { difficulty: editItemData.difficulty } : {})
    };

    setContentItems(prev => prev.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setIsEditModalOpen(false);
    setEditingItem(null);
    
    // For projects, navigate to project page after editing as per requirements
    if (updatedItem.type === 'project') {
      router.push(`/courses/${courseId}/projects/${updatedItem.id}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
    setEditItemData({
      type: 'module',
      title: '',
      description: '',
      duration: 1,
      difficulty: 'Easy'
    });
  };

  const handleCardClick = (itemId: string) => {
    const item = contentItems.find(item => item.id === itemId);
    if (!item) return;

    if (item.type === 'module') {
      router.push(`/courses/${courseId}/modules/${itemId}`);
    } else if (item.type === 'project') {
      router.push(`/courses/${courseId}/projects/${itemId}`);
    }
  };

  // Drag and Drop Handlers (simplified)
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (!draggedItemId) return;

    const draggedIndex = contentItems.findIndex(item => item.id === draggedItemId);
    if (draggedIndex === -1 || draggedIndex === dropIndex) return;

    const newItems = [...contentItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    setContentItems(newItems);
    setDragOverIndex(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Course Curriculum</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary-dark h-12"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module/Project
        </Button>
      </div>

      {/* Content Items */}
      <div className="space-y-4">
        {contentItems.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              "transition-all duration-200 cursor-grab active:cursor-grabbing",
              draggedItemId === item.id && "opacity-50",
              dragOverIndex === index && "border-t-2 border-primary"
            )}
          >
            <Card 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleCardClick(item.id)}
            >
              <CardContent className="p-0">
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div 
                    className="cursor-grab hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Icon */}
                  <div className="text-muted-foreground">
                    <FolderOpen className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-lg">{getContentIndex(index)}: {item.title}</h3>
                      {item.type === 'project' && item.difficulty && (
                        <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Duration: {item.duration} {item.duration === 1 ? 'week' : 'weeks'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditItem(item.id);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Add Module/Project Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add {newItemData.type === 'module' ? 'Module' : 'Project'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                value={newItemData.type}
                onValueChange={(value: 'module' | 'project') =>
                  setNewItemData(prev => ({ ...prev, type: value }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="module" id="module" />
                  <Label htmlFor="module">Module</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="project" />
                  <Label htmlFor="project">Project</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                {newItemData.type === 'module' ? 'Module' : 'Project'} Title *
              </Label>
              <Input
                id="title"
                value={newItemData.title}
                onChange={(e) => setNewItemData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={`Enter ${newItemData.type} title`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newItemData.description}
                onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={`Describe the ${newItemData.type}`}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <CounterInput
                label="Duration"
                value={newItemData.duration}
                onChange={(value) => setNewItemData(prev => ({ ...prev, duration: value }))}
                min={1}
                max={52}
                unit={newItemData.duration === 1 ? 'week' : 'weeks'}
              />
            </div>

            {newItemData.type === 'project' && (
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <RadioGroup
                  value={newItemData.difficulty}
                  onValueChange={(value: 'Easy' | 'Medium' | 'Hard') =>
                    setNewItemData(prev => ({ ...prev, difficulty: value }))
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Easy" id="easy" />
                    <Label htmlFor="easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hard" id="hard" />
                    <Label htmlFor="hard">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={!newItemData.title || !newItemData.description}
                className="bg-primary hover:bg-primary-dark"
              >
                Add {newItemData.type === 'module' ? 'Module' : 'Project'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Module/Project Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {editItemData.type === 'module' ? 'Module' : 'Project'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup
                value={editItemData.type}
                onValueChange={(value: 'module' | 'project') =>
                  setEditItemData(prev => ({ ...prev, type: value }))
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="module" id="edit-module" />
                  <Label htmlFor="edit-module">Module</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="edit-project" />
                  <Label htmlFor="edit-project">Project</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">
                {editItemData.type === 'module' ? 'Module' : 'Project'} Title *
              </Label>
              <Input
                id="edit-title"
                value={editItemData.title}
                onChange={(e) => setEditItemData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={`Enter ${editItemData.type} title`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={editItemData.description}
                onChange={(e) => setEditItemData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={`Describe the ${editItemData.type}`}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <CounterInput
                label="Duration"
                value={editItemData.duration}
                onChange={(value) => setEditItemData(prev => ({ ...prev, duration: value }))}
                min={1}
                max={52}
                unit={editItemData.duration === 1 ? 'week' : 'weeks'}
              />
            </div>

            {editItemData.type === 'project' && (
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <RadioGroup
                  value={editItemData.difficulty}
                  onValueChange={(value: 'Easy' | 'Medium' | 'Hard') =>
                    setEditItemData(prev => ({ ...prev, difficulty: value }))
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Easy" id="edit-easy" />
                    <Label htmlFor="edit-easy">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="edit-medium" />
                    <Label htmlFor="edit-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hard" id="edit-hard" />
                    <Label htmlFor="edit-hard">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateItem}
                disabled={!editItemData.title || !editItemData.description}
                className="bg-primary hover:bg-primary-dark"
              >
                Update {editItemData.type === 'module' ? 'Module' : 'Project'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurriculumTab;
