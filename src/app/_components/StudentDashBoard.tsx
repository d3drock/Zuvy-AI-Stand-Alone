'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, CheckCircle2, AlertCircle, TrendingUp, BarChart3, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudent } from '@/lib/hooks/useStudent';
import Image from 'next/image';

export default function StudentDashboard() {
  const router = useRouter();
  const {
    completedBootcamps,
    inProgressBootcamps,
    totalCompleted,
    totalInProgress,
    loading,
    error,
    refetch
  } = useStudent();

  // Calculate total unique topics across all in-progress bootcamps
  const uniqueTopics = new Set(
    inProgressBootcamps.map((bootcamp) => bootcamp.bootcampTopic).filter(Boolean)
  );

  // Calculate total duration
  const totalDuration = inProgressBootcamps.reduce(
    (sum, bootcamp) => sum + (bootcamp.duration || 0),
    0
  );

  const handleStartBootcamp = (bootcampId: number) => {
    // Navigate to bootcamp details or learning page
    router.push(`/student/bootcamp/${bootcampId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  return (
    <div className="w-full px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-h5 text-foreground mb-2">
          My Bootcamps
        </h1>
        <p className="text-body2 text-muted-foreground">
          Track your progress and continue learning
        </p>
      </div>

      {/* Quick Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-body2 text-muted-foreground">In Progress</p>
              <p className="text-h5 font-semibold">{totalInProgress}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-body2 text-muted-foreground">Completed</p>
              <p className="text-h5 font-semibold">{totalCompleted}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-body2 text-muted-foreground">Total Duration</p>
              <p className="text-h5 font-semibold">{totalDuration} weeks</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-body2 text-muted-foreground">Topics Covered</p>
              <p className="text-h5 font-semibold">{uniqueTopics.size}</p>
            </div>
          </div>
        </Card>
      </div> */}

      {/* Tabs */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              Loading bootcamps...
            </h3>
            <p className="text-body2 text-muted-foreground">
              Please wait a moment.
            </p>
          </Card>
        ) : error ? (
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              Error Loading Bootcamps
            </h3>
            <p className="text-body2 text-muted-foreground mb-4">
              {error}
            </p>
            <Button onClick={refetch}>Try Again</Button>
          </Card>
        ) : inProgressBootcamps.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              No bootcamps in progress
            </h3>
            <p className="text-body2 text-muted-foreground">
              You haven't started any bootcamps yet.
            </p>
          </Card>
        ) : (
          inProgressBootcamps.map((bootcamp) => (
            <Card
              key={bootcamp.id}
              className="p-6 hover:shadow-8dp transition-shadow"
            >
              <div className="flex items-start gap-6">
                {/* Cover Image */}
                {bootcamp.coverImage ? (
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={bootcamp.coverImage}
                      alt={bootcamp.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) :    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                       <Image
                                    src="/zuvy-logo-horizontal.png"
                                    alt="Zuvy"
                                    width={100}
                                    height={100}
                                    className="h-auto w-auto mt-6"
                                    priority
                                  />
                  </div>}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-body1 font-semibold">
                          {bootcamp.name}
                        </h3>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          In Progress
                        </Badge>
                      </div>

                      <p className="text-body2  mb-3">
                        {bootcamp.description}
                      </p>

                      {/* Progress Bar */}
                      {/* <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-body2 text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-body2 font-medium text-primary">
                            {bootcamp.progress}%
                          </span>
                        </div>
                        <Progress value={bootcamp.progress} className="h-2" />
                      </div> */}

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-body2  flex-wrap">
                        {/* <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Batch: {bootcamp.batchName}</span>
                        </div>

                        {bootcamp.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{bootcamp.duration} weeks</span>
                          </div>
                        )} */}

                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>{bootcamp.language}</span>
                        </div>

                        {bootcamp.bootcampTopic && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{bootcamp.bootcampTopic}</span>
                          </div>
                        )}
                      </div>

                      {/* Instructor */}
                      {/* <div className="mt-4 flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {bootcamp.instructorDetails.profilePicture ? (
                            <img
                              src={bootcamp.instructorDetails.profilePicture}
                              alt={bootcamp.instructorDetails.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-body2 text-muted-foreground">
                            Instructor
                          </p>
                          <p className="text-body2 font-medium">
                            {bootcamp.instructorDetails.name}
                          </p>
                        </div>
                      </div> */}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleStartBootcamp(bootcamp.id)}
                      className="flex items-center gap-2 "
                    >
                      <span>Continue</span>
                      <Play className="" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
