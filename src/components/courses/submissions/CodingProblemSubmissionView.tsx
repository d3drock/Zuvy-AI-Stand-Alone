'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Database, Copy } from 'lucide-react';
import { CodingSubmission, Student, CodingProblem } from '@/types';

interface CodingProblemSubmissionViewProps {
  submission: CodingSubmission;
  student: Student;
  problem: CodingProblem;
  onBack: () => void;
}

export const CodingProblemSubmissionView = ({
  submission,
  student,
  problem,
  onBack
}: CodingProblemSubmissionViewProps) => {
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

  const passedTests = submission.testResults.filter(test => test.passed).length;
  const totalTests = submission.testResults.length;
  const passPercentage = Math.round((passedTests / totalTests) * 100);

  const getStatusBadge = () => {
    if (passPercentage === 100) {
      return <Badge className="bg-success text-success-foreground">PASSED</Badge>;
    } else if (passPercentage > 0) {
      return <Badge className="bg-warning text-warning-foreground">PARTIAL</Badge>;
    } else {
      return <Badge variant="destructive">FAILED</Badge>;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
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

      {/* Problem Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
      </div>

      {/* Student Info */}
      <div className="max-w-6xl mx-auto">
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

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {getStatusBadge()}
                </div>
                <div className="text-2xl font-bold">{passedTests}/{totalTests}</div>
                <div className="text-sm text-muted-foreground">Test Cases</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                </div>
                <div className="text-2xl font-bold">142.5 KB</div>
                <div className="text-sm text-muted-foreground">Memory Usage</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 mr-2 text-success" />
                </div>
                <div className="text-2xl font-bold">0.45ms</div>
                <div className="text-sm text-muted-foreground">Execution Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Solution */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Solution</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {submission.language}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(submission.code)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>

              <Card className="bg-slate-900 text-slate-100">
                <CardContent className="p-0">
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code>{submission.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            {/* Test Results */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Test Results</h3>

              <div className="space-y-4">
                {submission.testResults.map((result, index) => (
                  <Card
                    key={result.testCaseId}
                    className={`border-l-4 ${
                      result.passed ? 'border-l-success' : 'border-l-destructive'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                          <span className="font-semibold">Test Case {index + 1}</span>
                        </div>
                        <Badge variant={result.passed ? "default" : "destructive"}>
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Input</p>
                          <div className="bg-muted p-2 rounded font-mono">
                            {/* Mock input - in real app would come from test case data */}
                            {index === 0 && "[-2, 1, -3, 4, -1, 2, 1, -5, 4]"}
                            {index === 1 && "[1]"}
                            {index > 1 && `Test input ${index + 1}`}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Expected Output</p>
                          <div className="bg-muted p-2 rounded font-mono">
                            {index === 0 && "6"}
                            {index === 1 && "1"}
                            {index > 1 && `Expected ${index + 1}`}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Your Output</p>
                          <div className={`p-2 rounded font-mono ${
                            result.passed ? 'bg-success-light text-success-dark' : 'bg-destructive-light text-destructive-dark'
                          }`}>
                            {result.output || (index === 0 ? "6" : index === 1 ? "1" : `Output ${index + 1}`)}
                          </div>
                        </div>
                      </div>

                      {result.error && (
                        <div className="mt-3">
                          <p className="font-medium text-destructive mb-1">Error</p>
                          <div className="bg-destructive-light p-2 rounded text-destructive-dark text-sm font-mono">
                            {result.error}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          98 ms
                        </span>
                        <span className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          7.71 KB
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};