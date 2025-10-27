
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ProblemData {
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  language: string;
}

interface ProblemDetailsFormProps {
  data: ProblemData;
  onDataChange: (field: string, value: string | number) => void;
}

const ProblemDetailsForm = ({ data, onDataChange }: ProblemDetailsFormProps) => {
  const topics = ['Algorithms', 'Data Structures', 'JavaScript', 'React', 'Node.js'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  return (
    <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="problem-title" className="font-semibold">Problem Title *</Label>
          <Input
            id="problem-title"
            placeholder="e.g., Two Sum, Reverse Linked List"
            value={data.title}
            onChange={(e) => onDataChange('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="problem-description" className="font-semibold">Problem Description *</Label>
          <Textarea
            id="problem-description"
            placeholder="Describe the problem, including constraints and examples..."
            value={data.description}
            onChange={(e) => onDataChange('description', e.target.value)}
            className="min-h-[120px]"
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


        <div className="space-y-2">
          <Label className="font-semibold">Programming Language</Label>
          <Select value={data.language} onValueChange={(value) => onDataChange('language', value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    </div>
  );
};

export default ProblemDetailsForm;
