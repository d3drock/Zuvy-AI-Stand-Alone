
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MCQForm from './mcq-creator/MCQForm';
import OptionsEditor from './mcq-creator/OptionsEditor';

interface MCQCreatorProps {
  onSave: () => void;
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

const MCQCreator = ({ onSave }: MCQCreatorProps) => {
  const [questionData, setQuestionData] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: ''
  });
  
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false }
  ]);

  const handleInputChange = (field: string, value: string | number) => {
    setQuestionData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (optionId: string, text: string) => {
    setOptions(prev => prev.map(option =>
      option.id === optionId ? { ...option, text } : option
    ));
  };

  const handleCorrectChange = (optionId: string, isCorrect: boolean) => {
    setOptions(prev => prev.map(option =>
      option.id === optionId ? { ...option, isCorrect } : option
    ));
  };

  const addOption = () => {
    const newOption: Option = {
      id: Date.now().toString(),
      text: '',
      isCorrect: false
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (optionId: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== optionId));
    }
  };

  const handleSave = () => {
    console.log('Saving MCQ:', { questionData, options });
    onSave();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">One at a Time</TabsTrigger>
          <TabsTrigger value="bulk" disabled>Bulk Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-6">
          <MCQForm
            data={questionData}
            onDataChange={handleInputChange}
          />

          <OptionsEditor
            options={options}
            onOptionChange={handleOptionChange}
            onCorrectChange={handleCorrectChange}
            onAddOption={addOption}
            onRemoveOption={removeOption}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onSave}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark">
              Create Question
            </Button>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default MCQCreator;
