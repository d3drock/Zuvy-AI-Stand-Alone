
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import ContentBankTab from './ContentBankTab';
import CreateQuestionTab from './CreateQuestionTab';
import SelectedQuestionsPanel from './SelectedQuestionsPanel';
import MCQCreatorModal from './MCQCreatorModal';
import CodingCreatorModal from './CodingCreatorModal';
import OpenEndedCreatorModal from './OpenEndedCreatorModal';
import { Question } from './types';

interface AssessmentBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

type ViewType = 'main' | 'create-mcq' | 'create-coding' | 'create-open-ended';

const AssessmentBuilderModal = ({ isOpen, onClose, courseId }: AssessmentBuilderModalProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleQuestionSelect = (question: Question) => {
    if (!selectedQuestions.find(q => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleQuestionRemove = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
  };

  const handleCreateAssessment = () => {
    console.log('Creating assessment with questions:', selectedQuestions);
    onClose();
  };

  const handleQuestionCreated = (question: Question) => {
    setSelectedQuestions([...selectedQuestions, question]);
    setCurrentView('main');
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  if (currentView === 'create-mcq') {
    return (
      <MCQCreatorModal
        isOpen={isOpen}
        onClose={onClose}
        onBack={handleBack}
        onQuestionCreated={handleQuestionCreated}
        setIsCreating={setIsCreating}
        isCreating={isCreating}
      />
    );
  }

  if (currentView === 'create-coding') {
    return (
      <CodingCreatorModal
        isOpen={isOpen}
        onClose={onClose}
        onBack={handleBack}
        onQuestionCreated={handleQuestionCreated}
        setIsCreating={setIsCreating}
        isCreating={isCreating}
      />
    );
  }

  if (currentView === 'create-open-ended') {
    return (
      <OpenEndedCreatorModal
        isOpen={isOpen}
        onClose={onClose}
        onBack={handleBack}
        onQuestionCreated={handleQuestionCreated}
        setIsCreating={setIsCreating}
        isCreating={isCreating}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Assessment Builder</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6 h-[600px]">
          <div className="flex-1">
            <Tabs defaultValue="content-bank" className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="content-bank">Content Bank</TabsTrigger>
                <TabsTrigger value="create-question">Create Question</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content-bank" className="h-[calc(100%-60px)]">
                <ContentBankTab onQuestionSelect={handleQuestionSelect} />
              </TabsContent>
              
              <TabsContent value="create-question" className="h-[calc(100%-60px)]">
                <CreateQuestionTab
                  onCreateMCQ={() => setCurrentView('create-mcq')}
                  onCreateCoding={() => setCurrentView('create-coding')}
                  onCreateOpenEnded={() => setCurrentView('create-open-ended')}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <SelectedQuestionsPanel
            selectedQuestions={selectedQuestions}
            onQuestionRemove={handleQuestionRemove}
            onCreateAssessment={handleCreateAssessment}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentBuilderModal;
