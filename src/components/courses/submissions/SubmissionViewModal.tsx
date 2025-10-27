import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download } from 'lucide-react';
import { 
  Submission, 
  AssignmentSubmission, 
  QuizSubmission, 
  CodingSubmission, 
  AssessmentSubmission,
  ProjectSubmission,
  FeedbackSubmission
} from '@/types';

interface SubmissionViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
  studentName: string;
  onApproveReAttempt?: (submissionId: string) => void;
}

export const SubmissionViewModal = ({
  open,
  onOpenChange,
  submission,
  studentName,
  onApproveReAttempt
}: SubmissionViewModalProps) => {
  if (!submission) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const renderSubmissionContent = () => {
    switch (submission.itemType) {
      case 'assignment':
        const assignmentSub = submission as AssignmentSubmission;
        return (
          <div className="space-y-4">
            {assignmentSub.content && (
              <div>
                <h3 className="font-medium mb-1">Text Submission:</h3>
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {assignmentSub.content}
                </div>
              </div>
            )}
            {assignmentSub.fileUrl && (
              <div>
                <h3 className="font-medium mb-1">File Submission:</h3>
                <a 
                  href={assignmentSub.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download Submission
                </a>
              </div>
            )}
            {assignmentSub.grade !== undefined && (
              <div>
                <h3 className="font-medium mb-1">Grade:</h3>
                <p>{assignmentSub.grade}/100</p>
              </div>
            )}
            {assignmentSub.feedback && (
              <div>
                <h3 className="font-medium mb-1">Feedback:</h3>
                <p>{assignmentSub.feedback}</p>
              </div>
            )}
          </div>
        );
      
      case 'quiz':
        const quizSub = submission as QuizSubmission;
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Score:</h3>
              <p>{quizSub.score}/{quizSub.totalPossible} ({Math.round((quizSub.score / quizSub.totalPossible) * 100)}%)</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Answers:</h3>
              <ul className="space-y-2">
                {quizSub.answers.map((answer, index) => (
                  <li key={answer.questionId} className="bg-muted p-2 rounded-md">
                    <span className="font-medium">Question {index + 1}:</span>{' '}
                    {Array.isArray(answer.answer) 
                      ? answer.answer.join(', ') 
                      : answer.answer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'coding':
        const codingSub = submission as CodingSubmission;
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Score:</h3>
              <p>{codingSub.score}/{codingSub.totalPossible} ({Math.round((codingSub.score / codingSub.totalPossible) * 100)}%)</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Language:</h3>
              <p>{codingSub.language}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Code:</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{codingSub.code}</code>
              </pre>
            </div>
            <div>
              <h3 className="font-medium mb-1">Test Results:</h3>
              <ul className="space-y-2">
                {codingSub.testResults.map((result, index) => (
                  <li key={result.testCaseId} className="bg-muted p-2 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Test Case {index + 1}:</span>
                      {result.passed ? (
                        <Badge className="bg-success-light text-success-dark">Passed</Badge>
                      ) : (
                        <Badge className="bg-destructive-light text-destructive-dark">Failed</Badge>
                      )}
                    </div>
                    {result.output && (
                      <div className="mt-1">
                        <span className="text-sm text-muted-foreground">Output:</span>{' '}
                        <span className="text-sm">{result.output}</span>
                      </div>
                    )}
                    {result.error && (
                      <div className="mt-1">
                        <span className="text-sm text-destructive">Error:</span>{' '}
                        <span className="text-sm">{result.error}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'assessment':
        const assessmentSub = submission as AssessmentSubmission;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Score:</h3>
                <p>{assessmentSub.percentageObtained}% ({assessmentSub.score}/{assessmentSub.totalPossible})</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Status:</h3>
                {assessmentSub.qualified ? (
                  <Badge className="bg-success-light text-success-dark">Qualified</Badge>
                ) : (
                  <Badge className="bg-destructive-light text-destructive-dark">Not Qualified</Badge>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-1">Time Taken:</h3>
                <p>{formatDuration(assessmentSub.timeTaken)}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Attempts:</h3>
                <p>{assessmentSub.numberOfAttempts}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Answers:</h3>
              <ul className="space-y-2">
                {assessmentSub.answers.map((answer, index) => (
                  <li key={answer.questionId} className="bg-muted p-2 rounded-md">
                    <div>
                      <span className="font-medium">Question {index + 1} ({answer.questionType}):</span>
                    </div>
                    <div className="mt-1">
                      {answer.questionType === 'Coding' && typeof answer.answer === 'object' ? (
                        <pre className="text-sm overflow-x-auto">
                          <code>{(answer.answer as any).code}</code>
                        </pre>
                      ) : Array.isArray(answer.answer) ? (
                        answer.answer.join(', ')
                      ) : (
                        <span>{String(answer.answer)}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'project':
        const projectSub = submission as ProjectSubmission;
        return (
          <div className="space-y-4">
            {projectSub.content && (
              <div>
                <h3 className="font-medium mb-1">Text Submission:</h3>
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {projectSub.content}
                </div>
              </div>
            )}
            {projectSub.fileUrl && (
              <div>
                <h3 className="font-medium mb-1">File Submission:</h3>
                <a 
                  href={projectSub.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download Project
                </a>
              </div>
            )}
            {projectSub.url && (
              <div>
                <h3 className="font-medium mb-1">URL Submission:</h3>
                <a 
                  href={projectSub.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {projectSub.url}
                </a>
              </div>
            )}
            {projectSub.grade !== undefined && (
              <div>
                <h3 className="font-medium mb-1">Grade:</h3>
                <p>{projectSub.grade}/100</p>
              </div>
            )}
            {projectSub.feedback && (
              <div>
                <h3 className="font-medium mb-1">Feedback:</h3>
                <p>{projectSub.feedback}</p>
              </div>
            )}
          </div>
        );
      
      case 'feedback':
        const feedbackSub = submission as FeedbackSubmission;
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Responses:</h3>
              <ul className="space-y-2">
                {feedbackSub.answers.map((answer, index) => (
                  <li key={answer.questionId} className="bg-muted p-2 rounded-md">
                    <div>
                      <span className="font-medium">Question {index + 1}:</span>
                    </div>
                    <div className="mt-1">
                      {typeof answer.answer === 'number' && answer.answer <= 5 ? (
                        <div className="flex items-center gap-1">
                          {Array(5).fill(0).map((_, i) => (
                            <span
                              key={i}
                              className={`h-4 w-4 rounded-full ${i < (answer.answer as number) ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                            />
                          ))}
                          <span className="ml-2">{answer.answer}/5</span>
                        </div>
                      ) : (
                        <span>{String(answer.answer)}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      default:
        return <p>No submission data available</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-1">
              <span>{studentName}</span>
              <span className="text-muted-foreground text-sm">
                Submitted on {formatDate(submission.submissionDate)}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderSubmissionContent()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {submission.itemType === 'assessment' && onApproveReAttempt && (
            <Button 
              variant="default"
              disabled={!(submission as AssessmentSubmission).hasReAttemptRequest}
              onClick={() => {
                onApproveReAttempt(submission.id);
                onOpenChange(false);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Approve Re-attempt
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 