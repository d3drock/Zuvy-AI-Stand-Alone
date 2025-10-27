
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Calendar, Video, FileText, BookOpen, PlayCircle, MessageSquare, Code, ClipboardCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AssessmentBuilderModal from '../assessment-builder/AssessmentBuilderModal';
import { LiveClassEditor } from '../learning-item-editors/LiveClassEditor';
import { VideoEditor } from '../learning-item-editors/VideoEditor';
import { ArticleEditor } from '../learning-item-editors/ArticleEditor';
import { AssignmentEditor } from '../learning-item-editors/AssignmentEditor';
import { QuizEditor } from '../learning-item-editors/QuizEditor';
import { FeedbackFormEditor } from '../learning-item-editors/FeedbackFormEditor';
import { CodingProblemEditor } from '../learning-item-editors/CodingProblemEditor';

interface ContentTypeSelectorProps {
  onClose: () => void;
  onSelect: (type: string) => void;
}

const ContentTypeSelector = ({ onClose, onSelect }: ContentTypeSelectorProps) => {
  const [isAssessmentBuilderOpen, setIsAssessmentBuilderOpen] = useState(false);
  const [creatorView, setCreatorView] = useState<string | null>(null);

  const contentTypes = [
    {
      type: 'live-class',
      title: 'Live Class',
      icon: Calendar,
      color: 'bg-blue-light text-blue-dark'
    },
    {
      type: 'video',
      title: 'Video Content',
      icon: Video,
      color: 'bg-purple-light text-purple-dark'
    },
    {
      type: 'article',
      title: 'Article/Reading',
      icon: FileText,
      color: 'bg-green-light text-green-dark'
    },
    {
      type: 'assignment',
      title: 'Assignment',
      icon: BookOpen,
      color: 'bg-orange-light text-orange-dark'
    },
    {
      type: 'coding-problem',
      title: 'Coding Problem',
      icon: Code,
      color: 'bg-warning-light text-warning-dark'
    },
    {
      type: 'quiz',
      title: 'Quiz',
      icon: PlayCircle,
      color: 'bg-secondary-light text-secondary-dark'
    },
    {
      type: 'feedback-form',
      title: 'Feedback Form',
      icon: MessageSquare,
      color: 'bg-accent-light text-accent-dark'
    },
    {
      type: 'assessment',
      title: 'Assessment',
      icon: ClipboardCheck,
      color: 'bg-primary-light text-primary-dark'
    }
  ];

  const handleContentTypeSelect = (type: string) => {
    if (type === 'assessment') {
      setIsAssessmentBuilderOpen(true);
    } else {
      setCreatorView(type);
    }
    onSelect(type);
  };

  const handleCreatorClose = () => {
    setCreatorView(null);
    onClose();
  };

  const handleAssessmentBuilderClose = () => {
    setIsAssessmentBuilderOpen(false);
    onClose();
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
          hostName: ''
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
      case 'coding-problem':
        return {
          title: '',
          description: '',
          problemStatement: '',
          testCases: [{
            id: `test-${Date.now()}`,
            input: '',
            expectedOutput: '',
            isHidden: false
          }],
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
      case 'coding-problem':
        const codingData = getInitialData('coding-problem');
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
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {renderCreator()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Add Learning Content</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-2">
          {contentTypes.map((contentType) => {
            const IconComponent = contentType.icon;
            return (
              <Button
                key={contentType.type}
                variant="outline"
                className="h-auto p-3 flex items-center gap-2 justify-start"
                onClick={() => handleContentTypeSelect(contentType.type)}
              >
                <div className={`p-1 rounded ${contentType.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="text-sm">{contentType.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <AssessmentBuilderModal
        isOpen={isAssessmentBuilderOpen}
        onClose={handleAssessmentBuilderClose}
        courseId="1"
      />
    </>
  );
};

export default ContentTypeSelector;
