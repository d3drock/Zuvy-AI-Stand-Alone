'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUnsavedChanges } from '../curriculum/useUnsavedChanges';
import { UnsavedChangesModal } from '../curriculum/UnsavedChangesModal';

interface AssignmentData {
  title: string;
  instructions: string;
  instructionType: 'text' | 'pdf';
  instructionFileUrl?: string;
  dueDate?: Date;
  allowLateSubmission?: boolean;
  submissionTypes: ('file' | 'text' | 'url')[];
}

interface AssignmentEditorProps {
  initialData?: AssignmentData;
  onSave: (data: AssignmentData) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export function AssignmentEditor({ initialData, onSave, onCancel, mode }: AssignmentEditorProps) {
  const [data, setData] = useState<AssignmentData>(
    initialData || {
      title: '',
      instructions: '',
      instructionType: 'text',
      dueDate: undefined,
      allowLateSubmission: false,
      submissionTypes: ['file', 'text']
    }
  );

  const unsavedChanges = useUnsavedChanges();

  const handleChange = (field: keyof AssignmentData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    unsavedChanges.markAsUnsaved();
  };

  // Watch for data changes to mark as unsaved
  useEffect(() => {
    const hasChanges = JSON.stringify(data) !== JSON.stringify(initialData);
    if (hasChanges) {
      unsavedChanges.markAsUnsaved();
    }
  }, [data, initialData, unsavedChanges]);

  // Handle PDF file upload with validation
  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only');
        return;
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file);
      handleChange('instructionFileUrl', fileUrl);

      console.log('PDF instructions uploaded:', file.name, file.size, file.type);
    }
  };

  // Trigger PDF file upload
  const triggerPDFUpload = () => {
    document.getElementById('instruction-pdf-upload')?.click();
  };

  const handleSubmit = async () => {
    try {
      onSave(data);
      unsavedChanges.markAsSaved();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  // Handle cancel with unsaved changes check
  const handleCancel = () => {
    if (unsavedChanges.hasUnsavedChanges) {
      unsavedChanges.attemptAction(onCancel);
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {/* Title - Underlined style as per design specs */}
            <div className="space-y-3">
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Assignment Title"
                className="text-xl font-semibold bg-transparent border-none outline-none border-b-2 border-border focus:border-primary transition-colors w-full pb-1"
                style={{ fontSize: '1.25rem' }} // h5 size as per specs
              />
            </div>

            {/* Instructions - Text or PDF Option */}
            <div className="space-y-4">
              <Label>Instructions</Label>
              <RadioGroup
                value={data.instructionType}
                onValueChange={(value) => handleChange('instructionType', value as 'text' | 'pdf')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text-instructions" />
                  <Label htmlFor="text-instructions" className="cursor-pointer">Text Instructions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf-instructions" />
                  <Label htmlFor="pdf-instructions" className="cursor-pointer">Upload PDF</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Text Instructions */}
            {data.instructionType === 'text' && (
              <div className="space-y-2">
                <Label htmlFor="instructions">Assignment Instructions</Label>
                <Textarea
                  id="instructions"
                  value={data.instructions}
                  onChange={(e) => handleChange('instructions', e.target.value)}
                  placeholder="Enter detailed instructions for the assignment..."
                  className="min-h-[200px]"
                />
              </div>
            )}

            {/* PDF Instructions Upload */}
            {data.instructionType === 'pdf' && (
              <div className="space-y-2">
                <Label>Upload PDF Instructions</Label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                  id="instruction-pdf-upload"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Drag and drop or click to upload PDF instructions</p>
                    <p className="text-xs text-gray-500">Supported format: PDF files only (Max 10MB)</p>
                    <Button variant="outline" onClick={triggerPDFUpload} className="mt-3">
                      <FileText className="h-4 w-4 mr-2" />
                      Choose PDF File
                    </Button>
                  </div>
                </div>
                {data.instructionFileUrl && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-green-800 font-medium">✓ PDF instructions uploaded</p>
                        <p className="text-xs text-green-600">Ready for preview</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(data.instructionFileUrl, '_blank')}
                      >
                        Preview PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Due Date (Optional) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <span className="text-sm text-muted-foreground">(Optional - leave empty if no due date)</span>
              </div>
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal max-w-xs",
                        !data.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data.dueDate ? format(data.dueDate, "PPP") : "No due date set"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={data.dueDate}
                      onSelect={(date) => handleChange('dueDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {data.dueDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChange('dueDate', undefined)}
                  >
                    Clear Date
                  </Button>
                )}
              </div>

              {!data.dueDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Students will see "No due date" for this assignment</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with CTA buttons */}
      <div className="flex justify-between items-center p-6 border-t bg-background sticky bottom-0">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {mode === 'create' ? 'Add Assignment' : 'Edit Assignment'}
        </Button>
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={unsavedChanges.showWarningModal}
        onClose={unsavedChanges.closeModal}
        onDiscard={unsavedChanges.discardChanges}
        onSave={() => unsavedChanges.saveAndContinue(handleSubmit)}
      />
    </div>
  );
} 