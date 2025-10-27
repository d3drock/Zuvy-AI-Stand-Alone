'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, CheckCircle, XCircle, Code, Copy, Monitor, Clock } from 'lucide-react';
import { CodingSubmission, Student, CodingProblem } from '@/types';

interface CodingModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: CodingSubmission;
  student: Student;
  problem: CodingProblem;
}

export const CodingModalView = ({
  open,
  onOpenChange,
  submission,
  student,
  problem
}: CodingModalViewProps) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{problem.title}</DialogTitle>
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

          {/* Metrics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Test Cases</span>
                </div>
                <p className="text-lg font-bold text-orange-700">3/6</p>
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">Partial</Badge>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Memory Usage</span>
                </div>
                <p className="text-lg font-bold text-blue-700">142.5 KB</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Execution Time</span>
                </div>
                <p className="text-lg font-bold text-green-700">0.45ms</p>
              </CardContent>
            </Card>
          </div>

          {/* Solution */}
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Code className="h-4 w-4" />
              Your Solution
              <Badge variant="outline" className="bg-orange-100 text-orange-700">{submission.language}</Badge>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </h4>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg">
              <pre className="text-sm">
                <code>{submission.code}</code>
              </pre>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Test Results</h4>
            <div className="space-y-3">
              {submission.testResults.map((result, index) => (
                <Card key={result.testCaseId} className={result.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-medium ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                          Test Case {index + 1}
                        </span>
                      </div>
                      <Badge className={result.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {result.passed ? 'PASSED' : 'FAILED'}
                      </Badge>
                    </div>

                    {result.output && (
                      <div className="grid grid-cols-3 gap-4 text-xs mb-2">
                        <div>
                          <p className="text-muted-foreground mb-1">Input</p>
                          <p className="font-mono">[5, 4, -1, 7, 8]</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Expected Output</p>
                          <p className="font-mono">23</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Your Output</p>
                          <p className={`font-mono ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.output}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>⏱ 127 ms</span>
                      <span>📊 8.26 KB</span>
                    </div>

                    {result.error && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                        <p className="font-medium mb-1">Error:</p>
                        <p className="font-mono">{result.error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};