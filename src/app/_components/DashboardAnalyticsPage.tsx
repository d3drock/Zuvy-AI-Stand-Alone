'use client';

import { useState } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PerformanceMetrics,
  ProficiencyDistribution,
} from '@/components/adaptive-assessment/analytics/PerformanceMetrics';
import { StudentPerformanceTable } from '@/components/adaptive-assessment/analytics/StudentPerformanceTable';
import { TopicPerformanceChart } from '@/components/adaptive-assessment/analytics/TopicPerformanceChart';
import { InterventionAlerts } from '@/components/adaptive-assessment/analytics/InterventionAlerts';
import { mockMentorInsights, mockStudentMetrics } from '@/types/mock-adaptive-data';
import { ProficiencyLevel } from '@/types/adaptive-assessment';

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedCohort, setSelectedCohort] = useState('all');

  // Mock student performance data
  const studentPerformanceData = [
    {
      id: 'student1',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      assessmentsCompleted: 5,
      averageScore: 80,
      proficiencyLevel: 'advanced' as ProficiencyLevel,
      lastActivity: '2025-01-21T10:15:00Z',
      improvementTrend: 'improving' as const,
      needsIntervention: false,
    },
    {
      id: 'student2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      assessmentsCompleted: 2,
      averageScore: 55,
      proficiencyLevel: 'basic' as ProficiencyLevel,
      lastActivity: '2025-01-19T16:45:00Z',
      improvementTrend: 'declining' as const,
      needsIntervention: true,
    },
    {
      id: 'student3',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@example.com',
      assessmentsCompleted: 3,
      averageScore: 72,
      proficiencyLevel: 'intermediate' as ProficiencyLevel,
      lastActivity: '2025-01-20T14:30:00Z',
      improvementTrend: 'stable' as const,
      needsIntervention: false,
    },
    {
      id: 'student4',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      assessmentsCompleted: 4,
      averageScore: 85,
      proficiencyLevel: 'advanced' as ProficiencyLevel,
      lastActivity: '2025-01-21T09:20:00Z',
      improvementTrend: 'improving' as const,
      needsIntervention: false,
    },
    {
      id: 'student5',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      assessmentsCompleted: 1,
      averageScore: 45,
      proficiencyLevel: 'basic' as ProficiencyLevel,
      lastActivity: '2025-01-18T11:00:00Z',
      improvementTrend: 'stable' as const,
      needsIntervention: true,
    },
  ];

  // Mock topic performance data
  const topicPerformanceData = [
    {
      topic: 'JavaScript',
      accuracy: 71,
      questionsAnswered: 125,
      averageDifficulty: 5.2,
      trend: 'up' as const,
    },
    {
      topic: 'React',
      accuracy: 78,
      questionsAnswered: 98,
      averageDifficulty: 6.1,
      trend: 'up' as const,
    },
    {
      topic: 'Data Structures',
      accuracy: 62,
      questionsAnswered: 87,
      averageDifficulty: 6.8,
      trend: 'down' as const,
    },
    {
      topic: 'Algorithms',
      accuracy: 68,
      questionsAnswered: 76,
      averageDifficulty: 7.2,
      trend: 'stable' as const,
    },
    {
      topic: 'Node.js',
      accuracy: 74,
      questionsAnswered: 65,
      averageDifficulty: 5.5,
      trend: 'up' as const,
    },
  ];

  // Calculate metrics
  const totalStudents = studentPerformanceData.length;
  const averageScore = Math.round(
    studentPerformanceData.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents
  );
  const completionRate = 87; // Mock
  const studentsNeedingHelp = studentPerformanceData.filter((s) => s.needsIntervention).length;

  const proficiencyDistribution = {
    basic: studentPerformanceData.filter((s) => s.proficiencyLevel === 'basic').length,
    intermediate: studentPerformanceData.filter((s) => s.proficiencyLevel === 'intermediate').length,
    advanced: studentPerformanceData.filter((s) => s.proficiencyLevel === 'advanced').length,
  };

  const handleViewStudent = (studentId: string) => {
    console.log('View student:', studentId);
    // Navigate to student details page
  };

  const handleContactStudent = (studentId: string) => {
    console.log('Contact student:', studentId);
    // Open email composer or chat
  };

  const handleExportData = () => {
    console.log('Exporting analytics data...');
    // Export to CSV/Excel
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-heading text-h5 text-foreground mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-body2 text-muted-foreground">
              Monitor student performance and identify intervention opportunities
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCohort} onValueChange={setSelectedCohort}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cohorts</SelectItem>
                <SelectItem value="cohort1">Cohort 2025-A</SelectItem>
                <SelectItem value="cohort2">Cohort 2025-B</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics
        totalStudents={totalStudents}
        averageScore={averageScore}
        completionRate={completionRate}
        studentsNeedingHelp={studentsNeedingHelp}
        averageProficiency="Intermediate"
        topPerformers={2}
        trends={{
          students: { value: 12, direction: 'up' },
          score: { value: 5, direction: 'up' },
          completion: { value: 3, direction: 'up' },
        }}
      />

      {/* Proficiency Distribution */}
      <div className="mb-8">
        <ProficiencyDistribution
          basic={proficiencyDistribution.basic}
          intermediate={proficiencyDistribution.intermediate}
          advanced={proficiencyDistribution.advanced}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="mb-6 bg-background border border-border p-1 h-auto">
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 transition-all px-6 py-2.5"
          >
            Student Performance
          </TabsTrigger>
          <TabsTrigger
            value="topics"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 transition-all px-6 py-2.5"
          >
            Topic Analysis
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 transition-all px-6 py-2.5"
          >
            Intervention Alerts
            {mockMentorInsights.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-warning text-warning-foreground rounded-full text-xs">
                {mockMentorInsights.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentPerformanceTable
            students={studentPerformanceData}
            onViewDetails={handleViewStudent}
          />
        </TabsContent>

        <TabsContent value="topics">
          <TopicPerformanceChart data={topicPerformanceData} />
        </TabsContent>

        <TabsContent value="alerts">
          <InterventionAlerts
            alerts={mockMentorInsights}
            onViewStudent={handleViewStudent}
            onContactStudent={handleContactStudent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
