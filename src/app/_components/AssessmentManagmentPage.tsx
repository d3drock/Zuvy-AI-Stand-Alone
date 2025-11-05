'use client';

import { useState } from 'react';
import { Plus, Search, Play, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssessmentConfigForm } from '@/components/adaptive-assessment/AssessmentConfigForm';
import TypingSkeleton from '@/components/adaptive-assessment/LoadingSkeletion';
import { useAiAssessment } from '@/lib/hooks/useAiAssessment';
import { useBootcamp } from '@/lib/hooks/useBootcamp';

export default function AssessmentManagementPage() {
  const [selectedBootcampId, setSelectedBootcampId] = useState<number | null>(null);
  
  const { assessment: getAssessments, loading, error , refetch } = useAiAssessment({ 
    bootcampId: selectedBootcampId 
  });
  const { bootcamps, loading: bootcampsLoading } = useBootcamp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>();
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');

  // Helper function to calculate total questions from topics
  const getTotalQuestions = (assessment: any): number => {
    // For API response with totalNumberOfQuestions field
    if (assessment.totalNumberOfQuestions) {
      return assessment.totalNumberOfQuestions;
    }
    // If topics is an array with objects containing count
    if (Array.isArray(assessment.topics)) {
      return assessment.topics.reduce((sum: number, topic: any) => sum + (topic.count || 0), 0);
    }
    // If topics is an object with counts
    if (assessment.topics && typeof assessment.topics === 'object') {
      return Object.values(assessment.topics).reduce((sum: number, count) => sum + Number(count || 0), 0);
    }
    return 0;
  };

  // Get unique topics from API assessments
  const availableTopics = Array.from(
    new Set(
      (getAssessments || []).flatMap((assessment) => {
        if (Array.isArray(assessment.topics)) {
          return assessment.topics.map((t: any) => t.topic);
        }
        if (assessment.topics && typeof assessment.topics === 'object') {
          return Object.keys(assessment.topics);
        }
        return [];
      })
    )
  );

  // Use API data or empty array
  const assessments = getAssessments || [];

  // Filter assessments by search query
  const filteredAssessments = assessments.filter((assessment) =>
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAssessment = () => {
    setSelectedAssessment(undefined);
    setEditorMode('create');
    setEditorOpen(true);
  };

  const handleSaveAssessment = (assessmentData: any) => {
    // After saving, refetch the assessments
    setEditorOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  console.log(getAssessments)
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

        {/* Bootcamp Filter */}
        <div className="mt-4 max-w-md">
          <Select
            value={selectedBootcampId?.toString() || undefined}
            onValueChange={(value) => setSelectedBootcampId(value === 'all' ? null : parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Bootcamps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bootcamps</SelectItem>
              {bootcamps.map((bootcamp) => (
                <SelectItem key={bootcamp.id} value={bootcamp.id.toString()}>
                  {bootcamp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            {assessments.length > 0
              ? Math.round(
                  assessments.reduce((sum, a) => sum + getTotalQuestions(a), 0) /
                    assessments.length
                )
              : 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Topics Covered</p>
          <p className="text-h5 font-semibold">{availableTopics.length}</p>
        </Card>
      </div>

      {/* Assessment List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center">
            <TypingSkeleton />
          </Card>
        ) : filteredAssessments.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              {selectedBootcampId 
                ? "No Assessments Found Related to the Bootcamp"
                : "No Assessments Found"
              }
            </h3>
            <p className="text-body2 text-muted-foreground mb-4">
              {selectedBootcampId 
                ? "Try selecting a different bootcamp or create a new assessment"
                : "Create a new assessment to get started"
              }
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
                    {assessment.description && (
                      <p className="text-body2 text-muted-foreground line-clamp-2">
                        {assessment.description}
                      </p>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-3 text-body2 text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      <span>{getTotalQuestions(assessment)} questions</span>
                    </div>
                    {assessment.difficulty && (
                      <div className="flex items-center gap-2">
                        <span>📊</span>
                        <span>{assessment.difficulty}</span>
                      </div>
                    )}
                    {assessment.audience && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{assessment.audience}</span>
                      </div>
                    )}
                  </div>

                  {/* Topics */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {Array.isArray(assessment.topics) ? (
                      assessment.topics.map((topicItem: any) => (
                        <Badge key={topicItem.topic} variant="outline">
                          {topicItem.topic} ({topicItem.count})
                        </Badge>
                      ))
                    ) : assessment.topics && typeof assessment.topics === 'object' ? (
                      Object.entries(assessment.topics).map(([topic, count]) => (
                        <Badge key={topic} variant="outline">
                          {topic} ({String(count)})
                        </Badge>
                      ))
                    ) : null}
                  </div>

                  {/* Dates */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    Created {formatDate(assessment.createdAt)} • Updated{' '}
                    {formatDate(assessment.updatedAt)}
                  </div>
                </div>

                {/* Actions - Removed for now since we're using API data */}
                <Button variant="ghost" size="icon" disabled>
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
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Assessment Config Form */}
      <AssessmentConfigForm
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveAssessment}
        mode={editorMode}
        refetch={refetch}
        bootcamps={bootcamps}
        bootcampsLoading={bootcampsLoading}
      />
    </div>
  );
}
