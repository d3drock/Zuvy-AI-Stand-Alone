
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface OptionsEditorProps {
  options: Option[];
  onOptionChange: (optionId: string, text: string) => void;
  onCorrectChange: (optionId: string, isCorrect: boolean) => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
}

const OptionsEditor = ({ 
  options, 
  onOptionChange, 
  onCorrectChange, 
  onAddOption, 
  onRemoveOption 
}: OptionsEditorProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Answer Options *</Label>
            <Button variant="outline" size="sm" onClick={onAddOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={(checked) => onCorrectChange(option.id, checked as boolean)}
                  />
                  <Label className="text-sm text-muted-foreground">
                    Correct
                  </Label>
                </div>
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => onOptionChange(option.id, e.target.value)}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveOption(option.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Check the box next to correct answer(s). Multiple correct answers are allowed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptionsEditor;
