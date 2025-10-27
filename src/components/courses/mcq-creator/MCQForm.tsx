
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface MCQFormData {
  title: string;
  description: string;
  topic: string;
  difficulty: string;
}

interface MCQFormProps {
  data: MCQFormData;
  onDataChange: (field: string, value: string | number) => void;
}

const MCQForm = ({ data, onDataChange }: MCQFormProps) => {
  const topics = ['JavaScript Basics', 'React Fundamentals', 'Node.js', 'Algorithms', 'Data Structures'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question-title" className="font-semibold">Question Title *</Label>
          <Textarea
            id="question-title"
            placeholder="Enter your question..."
            value={data.title}
            onChange={(e) => onDataChange('title', e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add context or additional information..."
            value={data.description}
            onChange={(e) => onDataChange('description', e.target.value)}
            className="min-h-[60px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Topic *</Label>
            <Select value={data.topic} onValueChange={(value) => onDataChange('topic', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Search or select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Difficulty *</Label>
            <Select value={data.difficulty} onValueChange={(value) => onDataChange('difficulty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

    </div>
  );
};

export default MCQForm;
