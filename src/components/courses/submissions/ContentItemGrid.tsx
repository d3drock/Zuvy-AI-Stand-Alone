'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  CheckSquare,
  Code,
  MessageSquare,
  ClipboardCheck,
  BookOpen,
  Clock
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  LearningItem, 
  Article, 
  Video, 
  Quiz, 
  Assignment, 
  CodingProblem, 
  Assessment,
  FeedbackForm,
  Project
} from '@/types';
import {
  mockArticles,
  mockVideos,
  mockQuizzes,
  mockAssignments,
  mockCodingProblems,
  mockAssessments,
  mockFeedbackForms,
  mockProjects,
  mockAssignmentSubmissions,
  mockQuizSubmissions,
  mockCodingSubmissions,
  mockAssessmentSubmissions,
  mockFeedbackSubmissions,
  mockProjectSubmissions,
} from '@/types/mock-data';
import { EmptySubmissionState } from './EmptySubmissionState';

interface ContentItemGridProps {
  courseId: string;
  submissionType: string;
  onSelectItem: (itemId: string) => void;
}

// Helper function to get icon by type
const getIconByType = (type: string) => {
  switch (type) {
    case 'article':
      return FileText;
    case 'video':
      return Clock;
    case 'quiz':
      return CheckSquare;
    case 'assignment':
      return FileText;
    case 'coding':
      return Code;
    case 'assessment':
      return ClipboardCheck;
    case 'feedback':
      return MessageSquare;
    case 'project':
      return BookOpen;
    default:
      return FileText;
  }
};

export const ContentItemGrid = ({ courseId, submissionType, onSelectItem }: ContentItemGridProps) => {
  const router = useRouter();
  const [items, setItems] = useState<LearningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionCounts, setSubmissionCounts] = useState<Record<string, number>>({});
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Simulate API call to fetch content items based on submission type
    setIsLoading(true);

    setTimeout(() => {
      let contentItems: LearningItem[] = [];
      let submissions: any[] = [];

      // For courseId '2' (Python for Data Science), show empty states
      if (courseId === '2') {
        contentItems = [];
        submissions = [];
      } else {
        // Get content items based on submission type
        switch (submissionType) {
          case 'assignments':
            contentItems = mockAssignments;
            submissions = mockAssignmentSubmissions;
            break;
          case 'quizzes':
            contentItems = mockQuizzes;
            submissions = mockQuizSubmissions;
            break;
          case 'coding':
            contentItems = mockCodingProblems;
            submissions = mockCodingSubmissions;
            break;
          case 'assessments':
            contentItems = mockAssessments;
            submissions = mockAssessmentSubmissions;
            break;
          case 'feedback':
            contentItems = mockFeedbackForms;
            submissions = mockFeedbackSubmissions;
            break;
          case 'projects':
            contentItems = mockProjects as any; // Type cast for now - would be properly typed in real implementation
            submissions = mockProjectSubmissions;
            break;
          default:
            contentItems = [];
            submissions = [];
        }
      }

      // Calculate submission counts for each item
      const counts: Record<string, number> = {};
      const pending: Record<string, number> = {};

      submissions.forEach(sub => {
        if (!counts[sub.itemId]) {
          counts[sub.itemId] = 0;
        }
        counts[sub.itemId]++;

        // Count pending (submitted but not graded/reviewed)
        if (sub.status === 'submitted') {
          if (!pending[sub.itemId]) {
            pending[sub.itemId] = 0;
          }
          pending[sub.itemId]++;
        }
      });

      setSubmissionCounts(counts);
      setPendingCounts(pending);
      setItems(contentItems);
      setIsLoading(false);
    }, 500);
  }, [submissionType, courseId]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptySubmissionState submissionType={submissionType} />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => {
            const Icon = getIconByType(item.type);
            const submissionCount = submissionCounts[item.id] || 0;
            const pendingCount = pendingCounts[item.id] || 0;

            return (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/submissions/${courseId}/${item.id}?type=${submissionType}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted p-2 rounded-md">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium text-base">{item.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">{submissionCount} submissions</Badge>
                    </div>
                    {pendingCount > 0 && (
                      <Badge variant="secondary" className="bg-warning-light text-warning-dark">
                        {pendingCount} pending
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}; 