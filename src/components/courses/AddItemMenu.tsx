
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Video, ClipboardCheck, Code, BookOpen, PlayCircle, Calendar, MessageSquare } from 'lucide-react';
import AssessmentBuilderModal from './assessment-builder/AssessmentBuilderModal';
import { LiveClassEditor } from './learning-item-editors/LiveClassEditor';
import { VideoEditor } from './learning-item-editors/VideoEditor';
import { ArticleEditor } from './learning-item-editors/ArticleEditor';
import { AssignmentEditor } from './learning-item-editors/AssignmentEditor';
import { QuizEditor } from './learning-item-editors/QuizEditor';
import { FeedbackFormEditor } from './learning-item-editors/FeedbackFormEditor';
import { CodingProblemEditor } from './learning-item-editors/CodingProblemEditor';

interface AddItemMenuProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

const AddItemMenu = ({ isOpen, onClose, courseId }: AddItemMenuProps) => {
  const [isAssessmentBuilderOpen, setIsAssessmentBuilderOpen] = useState(false);
  const [creatorView, setCreatorView] = useState<string | null>(null);

  const itemTypes = [
    {
      type: 'live-class',
      title: 'Live Class',
      description: 'Schedule live sessions with Zoom integration',
      icon: Calendar,
      color: 'bg-blue-light text-blue-dark'
    },
    {
      type: 'video',
      title: 'Video Content',
      description: 'Add video lectures or tutorials',
      icon: Video,
      color: 'bg-purple-light text-purple-dark'
    },
    {
      type: 'article',
      title: 'Article/Reading',
      description: 'Add articles, documentation, or text-based content',
      icon: FileText,
      color: 'bg-green-light text-green-dark'
    },
    {
      type: 'assignment',
      title: 'Assignment',
      description: 'Create project-based assignments',
      icon: BookOpen,
      color: 'bg-orange-light text-orange-dark'
    },
    {
      type: 'quiz',
      title: 'Quiz',
      description: 'Create quick knowledge checks',
      icon: PlayCircle,
      color: 'bg-secondary-light text-secondary-dark'
    },
    {
      type: 'feedback-form',
      title: 'Feedback Form',
      description: 'Collect student feedback and opinions',
      icon: MessageSquare,
      color: 'bg-accent-light text-accent-dark'
    },
    {
      type: 'coding-exercise',
      title: 'Coding Exercise',
      description: 'Add coding challenges and problems',
      icon: Code,
      color: 'bg-warning-light text-warning-dark'
    },
    {
      type: 'assessment',
      title: 'Assessment',
      description: 'Create comprehensive tests with multiple question types',
      icon: ClipboardCheck,
      color: 'bg-primary-light text-primary-dark'
    }
  ];

  const handleItemSelect = (type: string) => {
    if (type === 'assessment') {
      setIsAssessmentBuilderOpen(true);
    } else {
      setCreatorView(type);
    }
  };

  const handleCreatorClose = () => {
    setCreatorView(null);
    onClose();
  };

  const handleAssessmentBuilderClose = () => {
    setIsAssessmentBuilderOpen(false);
  };

  // Mock data for editors
  const getInitialData = (type: string) => {
    switch (type) {
      case 'live-class':
        return {
          title: '',
          description: '',
          startDate: new Date(),
          startTime: '10:00',
          endTime: '11:00',
          hostName: '',
          hostEmail: ''
        };
      case 'video':
        return {
          title: '',
          description: '',
          sourceType: 'youtube' as const,
          url: '',
          duration: 0
        };
      case 'article':
        return {
          title: '',
          content: '',
          contentType: 'rich-text' as const,
          estimatedReadTime: 5
        };
      case 'assignment':
        return {
          title: '',
          instructions: '',
          allowedSubmissionTypes: ['file', 'text'] as ('file' | 'text')[],
          dueDate: undefined
        };
      case 'quiz':
        return {
          title: '',
          description: '',
          questions: [],
          timeLimit: undefined,
          randomizeQuestions: false
        };
      case 'feedback-form':
        return {
          title: '',
          questions: []
        };
      case 'coding-exercise':
        return {
          title: '',
          description: '',
          problemStatement: '',
          testCases: [],
          allowedLanguages: ['JavaScript', 'Python'],
          starterCode: '// Your code here'
        };
      default:
        return {};
    }
  };

  const renderCreator = () => {
    switch (creatorView) {
      case 'live-class':
        const liveClassData = getInitialData('live-class');
        return (
          <LiveClassEditor
            mode="create"
            initialData={liveClassData as any}
            onSave={handleCreatorClose}
            onCancel={handleCreatorClose}
          />
        );
      case 'video':
        const videoData = getInitialData('video');
        return (
          <VideoEditor
            mode="create"
            initialData={videoData as any}
            onSave={handleCreatorClose}
            onCancel={handleCreatorClose}
          />
        );
      case 'article':
        const articleData = getInitialData('article');
        return (
          <ArticleEditor
            mode="create"
            initialData={articleData as any}
            onSave={handleCreatorClose}
            onCancel={handleCreatorClose}
          />
        );
      case 'assignment':
        const assignmentData = getInitialData('assignment');
        return (
          <AssignmentEditor
            mode="create"
            initialData={assignmentData as any}
            onSave={handleCreatorClose}
            onCancel={handleCreatorClose}
          />
        );
      case 'quiz':
        const quizData = getInitialData('quiz');
        return (
          <QuizEditor
            mode="create"
            initialData={quizData as any}
            onSave={handleCreatorClose}
            onCancel={handleCreatorClose}
          />
        );
      case 'feedback-form':
        const feedbackData = getInitialData('feedback-form');
        return (
          <FeedbackFormEditor
            mode="create"
            initialData={feedbackData as any}
            onSave={handleCreatorClose}
            onCancel={handleCreatorClose}
          />
        );
      case 'coding-exercise':
        const codingData = getInitialData('coding-exercise');
        return (
          <CodingProblemEditor
            mode="create"
            initialData={codingData as any}
            onSave={handleCreatorClose}
            onCancel={handleCreatorClose}
          />
        );
      default:
        return null;
    }
  };

  if (creatorView) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {renderCreator()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen && !isAssessmentBuilderOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Add Learning Content</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {itemTypes.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.type}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-3 hover:shadow-4dp transition-all"
                  onClick={() => handleItemSelect(item.type)}
                >
                  <div className={`p-2 rounded-md ${item.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <AssessmentBuilderModal
        isOpen={isAssessmentBuilderOpen}
        onClose={handleAssessmentBuilderClose}
        courseId={courseId}
      />
    </>
  );
};

export default AddItemMenu;
