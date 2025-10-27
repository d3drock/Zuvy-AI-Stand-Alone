'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, ExternalLink, Download } from 'lucide-react';
import { AssignmentSubmission, Student, Assignment } from '@/types';

interface AssignmentSubmissionViewProps {
  submission: AssignmentSubmission;
  student: Student;
  assignment: Assignment;
  onBack: () => void;
}

export const AssignmentSubmissionView = ({
  submission,
  student,
  assignment,
  onBack
}: AssignmentSubmissionViewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submissions
        </Button>
      </div>

      {/* Assignment Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
      </div>

      {/* Student Info */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{student.name}</h2>
            <p className="text-muted-foreground">
              Submitted on {formatDate(submission.submissionDate)}
            </p>
          </div>
        </div>

        {/* Submission Content */}
        <div className="space-y-6">
          {/* Text Content */}
          {submission.content && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Submission</h3>
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="whitespace-pre-wrap text-sm">
                    {submission.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* File/Link Submission */}
          {submission.fileUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Submission Link</h3>
              <Card className="bg-background border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Shared File/Link</p>
                        <p className="text-sm text-muted-foreground">
                          Click to view submission
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open(submission.fileUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Submission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Grade and Feedback */}
          {(submission.grade !== undefined || submission.feedback) && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Evaluation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submission.grade !== undefined && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Grade</p>
                        <p className="text-2xl font-bold text-primary">
                          {submission.grade}/100
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {submission.feedback && (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Feedback</p>
                      <p className="text-sm">{submission.feedback}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};