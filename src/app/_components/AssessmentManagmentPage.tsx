'use client';

import { useState } from 'react';
import { Plus, Search, Play, Edit, Trash2, Copy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AssessmentConfigForm } from '@/components/adaptive-assessment/AssessmentConfigForm';
import { mockAssessmentConfigs, mockAdaptiveQuestions } from '@/types/mock-adaptive-data';
import { AssessmentConfiguration } from '@/types/adaptive-assessment';

export default function AssessmentManagementPage() {
  const [assessments, setAssessments] = useState<AssessmentConfiguration[]>(
    mockAssessmentConfigs
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<
    AssessmentConfiguration | undefined
  >();
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');

  // Get unique topics from questions
  const availableTopics = Array.from(
    new Set(mockAdaptiveQuestions.map((q) => q.topic))
  );

  // Filter assessments
  const filteredAssessments = assessments.filter((assessment) =>
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAssessment = () => {
    setSelectedAssessment(undefined);
    setEditorMode('create');
    setEditorOpen(true);
  };

  const handleEditAssessment = (assessment: AssessmentConfiguration) => {
    setSelectedAssessment(assessment);
    setEditorMode('edit');
    setEditorOpen(true);
  };

  const handleDuplicateAssessment = (assessment: AssessmentConfiguration) => {
    const duplicated = {
      ...assessment,
      id: `config${Date.now()}`,
      title: `${assessment.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAssessments([...assessments, duplicated]);
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      setAssessments(assessments.filter((a) => a.id !== assessmentId));
    }
  };

  const handleSaveAssessment = (assessmentData: Partial<AssessmentConfiguration>) => {
    if (editorMode === 'create') {
      const newAssessment: AssessmentConfiguration = {
        ...assessmentData,
        id: `config${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as AssessmentConfiguration;
      setAssessments([...assessments, newAssessment]);
    } else if (selectedAssessment) {
      setAssessments(
        assessments.map((a) =>
          a.id === selectedAssessment.id
            ? { ...a, ...assessmentData, updatedAt: new Date().toISOString() }
            : a
        )
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-heading text-h5 text-foreground mb-2">
              Assessment Management
            </h1>
            <p className="text-body2 text-muted-foreground">
              Create and manage adaptive assessments
            </p>
          </div>
          <Button onClick={handleCreateAssessment} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Assessment
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Total Assessments</p>
          <p className="text-h5 font-semibold">{assessments.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Active</p>
          <p className="text-h5 font-semibold text-success">{assessments.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Avg Questions</p>
          <p className="text-h5 font-semibold">
            {Math.round(
              assessments.reduce((sum, a) => sum + a.totalQuestions, 0) /
                assessments.length
            )}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Topics Covered</p>
          <p className="text-h5 font-semibold">{availableTopics.length}</p>
        </Card>
      </div>

      {/* Assessment List */}
      <div className="space-y-4">
        {filteredAssessments.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              No assessments found
            </h3>
            <p className="text-body2 text-muted-foreground mb-4">
              Try adjusting your search or create a new assessment
            </p>
            <Button onClick={handleCreateAssessment} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Assessment
            </Button>
          </Card>
        ) : (
          filteredAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="p-6 hover:shadow-8dp transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-3">
                    <h3 className="font-heading text-body1 font-semibold mb-1">
                      {assessment.title}
                    </h3>
                    <p className="text-body2 text-muted-foreground line-clamp-2">
                      {assessment.description}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-3 text-body2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      <span>{assessment.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏱</span>
                      <span>{assessment.timeLimit} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>{assessment.passingScore}% to pass</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>0 attempts</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {assessment.topics.map((topic) => (
                      <Badge key={topic} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {/* Settings */}
                  <div className="flex items-center gap-3 text-xs">
                    {assessment.showFeedback && (
                      <Badge variant="secondary" className="text-xs">
                        Instant Feedback
                      </Badge>
                    )}
                    {assessment.allowRetry && (
                      <Badge variant="secondary" className="text-xs">
                        Retry: {assessment.retryDelay}h delay
                      </Badge>
                    )}
                    {assessment.randomizeOptions && (
                      <Badge variant="secondary" className="text-xs">
                        Randomized
                      </Badge>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    Created {formatDate(assessment.createdAt)} • Updated{' '}
                    {formatDate(assessment.updatedAt)}
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditAssessment(assessment)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicateAssessment(assessment)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteAssessment(assessment.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Assessment Config Form */}
      <AssessmentConfigForm
        config={selectedAssessment}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveAssessment}
        mode={editorMode}
        availableTopics={availableTopics}
      />
    </div>
  );
}
