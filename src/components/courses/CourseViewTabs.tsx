
'use client'

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, BookOpen, Users, Settings, FileText, UserCheck } from 'lucide-react';
import GeneralDetailsTab from './GeneralDetailsTab';
import CurriculumTab from './CurriculumTab';
import StudentsTab from './StudentsTab';
import SettingsTab from './SettingsTab';
import SubmissionsTab from './SubmissionsTab';
import BatchesTab from './BatchesTab';

interface CourseViewTabsProps {
  courseId: string;
}

const CourseViewTabs = ({ courseId }: CourseViewTabsProps) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('general');
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const [initialSubmissionType, setInitialSubmissionType] = useState<string | null>(null);
  const studentsTabRef = useRef<HTMLDivElement>(null);

  // Check URL parameters on mount
  useEffect(() => {
    const tab = searchParams.get('tab');
    const submissionType = searchParams.get('submissionType');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (submissionType) {
      setInitialSubmissionType(submissionType);
    }
  }, [searchParams]);

  // Listen for navigation events from BatchesTab
  useEffect(() => {
    const handleNavigateToStudents = (event: CustomEvent) => {
      const { batchName } = event.detail;
      setBatchFilter(batchName);
      setActiveTab('students');
      
      // Scroll to students tab after it renders
      setTimeout(() => {
        studentsTabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    window.addEventListener('navigateToStudents', handleNavigateToStudents as EventListener);

    return () => {
      window.removeEventListener('navigateToStudents', handleNavigateToStudents as EventListener);
    };
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 bg-card border border-border rounded-lg p-1 h-12">
        <TabsTrigger 
          value="general" 
          className="flex items-center justify-center gap-2 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">General Details</span>
          <span className="sm:hidden">General</span>
        </TabsTrigger>
        <TabsTrigger 
          value="curriculum"
          className="flex items-center justify-center gap-2 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Curriculum</span>
          <span className="sm:hidden">Content</span>
        </TabsTrigger>
        <TabsTrigger 
          value="students"
          className="flex items-center justify-center gap-2 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Students</span>
          <span className="sm:hidden">Students</span>
        </TabsTrigger>
        <TabsTrigger 
          value="batches"
          className="flex items-center justify-center gap-2 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <UserCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Batches</span>
          <span className="sm:hidden">Batches</span>
        </TabsTrigger>
        <TabsTrigger 
          value="submissions"
          className="flex items-center justify-center gap-2 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Submissions</span>
          <span className="sm:hidden">Submits</span>
        </TabsTrigger>
        <TabsTrigger 
          value="settings"
          className="flex items-center justify-center gap-2 h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="general" className="mt-0">
          <GeneralDetailsTab courseId={courseId} />
        </TabsContent>
        
        <TabsContent value="curriculum" className="mt-0">
          <CurriculumTab courseId={courseId} />
        </TabsContent>
        
        <TabsContent value="students" className="mt-0" ref={studentsTabRef}>
          <StudentsTab courseId={courseId} initialBatchFilter={batchFilter} />
        </TabsContent>
        
        <TabsContent value="batches" className="mt-0">
          <BatchesTab courseId={courseId} />
        </TabsContent>
        
        <TabsContent value="submissions" className="mt-0">
          <SubmissionsTab courseId={courseId} initialSubmissionType={initialSubmissionType} />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <SettingsTab courseId={courseId} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default CourseViewTabs;
