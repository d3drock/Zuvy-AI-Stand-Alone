'use client'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { X, ExternalLink } from 'lucide-react';
import { ProjectSubmission, Student, Project } from '@/types';

interface ProjectModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: ProjectSubmission;
  student: Student;
  project: Project;
}

export const ProjectModalView = ({
  open,
  onOpenChange,
  submission,
  student,
  project
}: ProjectModalViewProps) => {
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

  const getLinkType = (url: string) => {
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) return 'Google Drive';
    return 'External Link';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="flex items-center gap-4">
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
                <div className="bg-card p-4 rounded-md">
                  <div className="whitespace-pre-wrap text-sm">
                    {submission.content}
                  </div>
                </div>
              </div>
            )}

            {/* File Submission */}
            {submission.fileUrl && (
              <div>
                <Card className="bg-background border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{getLinkType(submission.fileUrl)}</p>
                          <p className="text-sm text-muted-foreground">
                            Click to view project files
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(submission.fileUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* URL Submission */}
            {submission.url && (
              <div>
                <Card className="bg-background border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{getLinkType(submission.url)}</p>
                          <p className="text-sm text-muted-foreground">
                            Live project URL
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.open(submission.url, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};