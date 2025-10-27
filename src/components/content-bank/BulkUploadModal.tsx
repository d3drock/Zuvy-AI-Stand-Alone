
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  difficulty: string;
  topic: string;
  status: 'valid' | 'warning' | 'error';
  issues?: string[];
}

const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);

  // Dummy parsed data for demonstration
  const dummyParsedQuestions: ParsedQuestion[] = [
    {
      id: '1',
      question: 'What is the correct way to declare a variable in JavaScript?',
      type: 'MCQ',
      options: ['var x = 1', 'let x = 1', 'const x = 1', 'All of the above'],
      correctAnswer: 'All of the above',
      difficulty: 'Easy',
      topic: 'JavaScript',
      status: 'valid'
    },
    {
      id: '2',
      question: 'Which method is used to add an element to an array?',
      type: 'MCQ',
      options: ['push()', 'add()', 'append()', 'insert()'],
      correctAnswer: 'push()',
      difficulty: 'Easy',
      topic: 'JavaScript',
      status: 'warning',
      issues: ['Topic not found in database - will be created']
    },
    {
      id: '3',
      question: '',
      type: 'MCQ',
      options: [],
      correctAnswer: '',
      difficulty: 'Easy',
      topic: 'JavaScript',
      status: 'error',
      issues: ['Question text is empty', 'No options provided']
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      handleFileUpload(csvFile);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    // Simulate parsing
    setTimeout(() => {
      setParsedQuestions(dummyParsedQuestions);
      setStep('review');
    }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'border-success bg-success-light';
      case 'warning':
        return 'border-warning bg-warning-light';
      case 'error':
        return 'border-destructive bg-destructive-light';
      default:
        return 'border-border bg-card';
    }
  };

  const validQuestions = parsedQuestions.filter(q => q.status === 'valid');
  const warningQuestions = parsedQuestions.filter(q => q.status === 'warning');
  const errorQuestions = parsedQuestions.filter(q => q.status === 'error');

  const handleImport = () => {
    console.log('Importing questions:', [...validQuestions, ...warningQuestions]);
    onClose();
    setStep('upload');
    setUploadedFile(null);
    setParsedQuestions([]);
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a CSV template
    console.log('Downloading CSV template');
  };

  const resetUpload = () => {
    setStep('upload');
    setUploadedFile(null);
    setParsedQuestions([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {step === 'upload' ? 'Bulk Upload Questions' : 'Review Questions'}
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 transition-colors",
                  isDragOver ? "border-primary bg-primary-light" : "border-muted-foreground/25"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">
                      Drag and drop your CSV file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="sr-only"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">CSV Format Requirements:</h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• First row should contain headers: question, type, options, correct_answer, difficulty, topic</li>
                  <li>• For MCQ questions, separate options with semicolons (;)</li>
                  <li>• Supported question types: MCQ, True/False, Fill in the Blank</li>
                  <li>• Difficulty levels: Easy, Medium, Hard</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6 py-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-success bg-success-light/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{validQuestions.length}</div>
                  <div className="text-sm text-success-dark">Valid Questions</div>
                </CardContent>
              </Card>
              <Card className="border-warning bg-warning-light/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">{warningQuestions.length}</div>
                  <div className="text-sm text-warning-dark">With Warnings</div>
                </CardContent>
              </Card>
              <Card className="border-destructive bg-destructive-light/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-destructive">{errorQuestions.length}</div>
                  <div className="text-sm text-destructive-dark">With Errors</div>
                </CardContent>
              </Card>
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parsedQuestions.map((question) => (
                <Card key={question.id} className={cn("border-l-4", getStatusColor(question.status))}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(question.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{question.type}</Badge>
                          <Badge variant="outline">{question.difficulty}</Badge>
                          <Badge variant="secondary">{question.topic}</Badge>
                        </div>
                        <p className="font-medium text-sm line-clamp-2">
                          {question.question || 'Missing question text'}
                        </p>
                        {question.issues && question.issues.length > 0 && (
                          <div className="mt-2">
                            <ul className="text-xs space-y-1">
                              {question.issues.map((issue, index) => (
                                <li key={index} className="text-muted-foreground">
                                  • {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={resetUpload}>
                Upload Different File
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={validQuestions.length === 0 && warningQuestions.length === 0}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Import {validQuestions.length + warningQuestions.length} Questions
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadModal;
