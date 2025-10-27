'use client'

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Upload, AlertTriangle } from 'lucide-react';

interface CourseValidation {
  courseDetails: boolean;
  hasModule: boolean;
  hasStudents: boolean;
}

interface PublishCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  onPublish?: () => void;
}

// Mock function to validate course readiness
const validateCourse = (courseId: string): CourseValidation => {
  // In a real app, this would fetch course data and validate
  return {
    courseDetails: true, // Assuming course details are filled
    hasModule: true,     // At least one module with learning items
    hasStudents: false   // No students assigned to batches
  };
};

const PublishCourseDialog = ({ 
  open, 
  onOpenChange, 
  courseId, 
  onPublish 
}: PublishCourseDialogProps) => {
  const [validation, setValidation] = useState<CourseValidation | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (open) {
      setValidation(validateCourse(courseId));
    }
  }, [open, courseId]);

  const isValid = validation && 
    validation.courseDetails && 
    validation.hasModule && 
    validation.hasStudents;

  const handlePublish = async () => {
    if (!isValid) return;
    
    setIsPublishing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPublish?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to publish course:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const validationChecks = [
    {
      key: 'courseDetails',
      label: 'Course details should be filled up',
      valid: validation?.courseDetails || false
    },
    {
      key: 'hasModule',
      label: 'At least one module with at least one learning item should be added in the curriculum',
      valid: validation?.hasModule || false
    },
    {
      key: 'hasStudents',
      label: 'At least one student should be added in the student list and also assigned to a created batch',
      valid: validation?.hasStudents || false
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Publish Course
          </DialogTitle>
          <DialogDescription>
            {isValid 
              ? "Publishing a course will make it available to the students"
              : "Please complete the following steps before publishing the course"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isValid && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your course is not ready to be published. Please complete all the requirements below.
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Checklist */}
          <div className="space-y-3">
            {validationChecks.map((check) => (
              <div key={check.key} className="flex items-start gap-3">
                {check.valid ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <p className={`text-sm ${check.valid ? 'text-green-700' : 'text-red-600'}`}>
                  {check.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={!isValid || isPublishing}
            className="bg-primary hover:bg-primary-dark"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishCourseDialog;