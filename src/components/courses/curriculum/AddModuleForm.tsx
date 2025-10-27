
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { NewModuleData } from './types';

interface AddModuleFormProps {
  newModuleData: NewModuleData;
  onDataChange: (data: NewModuleData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const AddModuleForm = ({ newModuleData, onDataChange, onSubmit, onCancel }: AddModuleFormProps) => {
  return (
    <Card className="shadow-4dp">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg">Add New Content</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={newModuleData.type === 'module' ? 'default' : 'outline'}
            onClick={() => onDataChange({ ...newModuleData, type: 'module' })}
          >
            Module
          </Button>
          <Button
            variant={newModuleData.type === 'project' ? 'default' : 'outline'}
            onClick={() => onDataChange({ ...newModuleData, type: 'project' })}
          >
            Project
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={newModuleData.title}
            onChange={(e) => onDataChange({ ...newModuleData, title: e.target.value })}
            placeholder={`Enter ${newModuleData.type} title`}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={newModuleData.description}
            onChange={(e) => onDataChange({ ...newModuleData, description: e.target.value })}
            placeholder={`Enter ${newModuleData.type} description`}
          />
        </div>
        <div className="space-y-2">
          <Label>Duration (weeks)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={newModuleData.duration || ''}
              onChange={(e) => onDataChange({ ...newModuleData, duration: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-20"
              min="0"
              max="52"
            />
            <span className="text-sm text-muted-foreground">weeks</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Duration will be used to calculate total course duration
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSubmit} disabled={!newModuleData.title.trim()}>
            Add {newModuleData.type}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddModuleForm;
