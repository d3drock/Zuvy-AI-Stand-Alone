
import { Button } from '@/components/ui/button';
import { Code, ClipboardCheck, FileText } from 'lucide-react';

interface CreateQuestionTabProps {
  onCreateMCQ: () => void;
  onCreateCoding: () => void;
  onCreateOpenEnded: () => void;
}

const CreateQuestionTab = ({ onCreateMCQ, onCreateCoding, onCreateOpenEnded }: CreateQuestionTabProps) => {
  const questionTypes = [
    {
      type: 'MCQ',
      title: 'Multiple Choice Question',
      description: 'Create questions with multiple choice answers',
      icon: ClipboardCheck,
      color: 'bg-primary-light text-primary-dark',
      onClick: onCreateMCQ
    },
    {
      type: 'Coding',
      title: 'Coding Problem',
      description: 'Create programming challenges with test cases',
      icon: Code,
      color: 'bg-warning-light text-warning-dark',
      onClick: onCreateCoding
    },
    {
      type: 'Open Ended',
      title: 'Open Ended Question',
      description: 'Create questions requiring descriptive answers',
      icon: FileText,
      color: 'bg-success-light text-success-dark',
      onClick: onCreateOpenEnded
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose the type of question you want to create
      </p>
      
      <div className="grid gap-4">
        {questionTypes.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.type}
              variant="outline"
              className="h-auto p-4 flex items-start gap-3 hover:shadow-4dp transition-all"
              onClick={item.onClick}
            >
              <div className={`p-2 rounded-md ${item.color}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CreateQuestionTab;
