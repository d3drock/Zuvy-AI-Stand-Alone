'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUnsavedChanges } from '../curriculum/useUnsavedChanges';
import { UnsavedChangesModal } from '../curriculum/UnsavedChangesModal';
import { LiveClassData, LiveClassStatus, MeetingPlatform, LiveClassMode } from '../curriculum/types';

interface LiveClassEditorProps {
  initialData?: Partial<LiveClassData>;
  mode: 'create' | 'edit';
  onSave: (data: LiveClassData) => void;
  onCancel: () => void;
}

// Mock existing classes data
const MOCK_EXISTING_CLASSES = [
  {
    id: 'existing-1',
    title: 'Introduction to JavaScript Basics',
    date: '2025-10-05',
    batchName: 'Batch A - Fall 2025',
  },
  {
    id: 'existing-2',
    title: 'Advanced React Patterns',
    date: '2025-10-08',
    batchName: 'Batch B - Fall 2025',
  },
  {
    id: 'existing-3',
    title: 'Node.js and Express Fundamentals',
    date: '2025-10-12',
    batchName: 'Batch A - Fall 2025',
  },
];

const DEFAULT_LIVE_CLASS_DATA: Partial<LiveClassData> = {
  title: '',
  description: '',
  mode: 'new',
  startDate: undefined,
  startTime: '',
  duration: 90,
  meetingPlatform: 'zoom',
  classStatus: 'upcoming',
};

/**
 * LiveClassEditor
 *
 * Editor component for creating and editing live classes.
 * Supports creating new classes or selecting from existing ones.
 * Displays different UI based on class status (upcoming, ongoing, completed).
 */
export function LiveClassEditor({
  initialData = DEFAULT_LIVE_CLASS_DATA,
  mode,
  onSave,
  onCancel,
}: LiveClassEditorProps) {
  const [liveClassData, setLiveClassData] = useState<Partial<LiveClassData>>({
    ...DEFAULT_LIVE_CLASS_DATA,
    ...initialData,
  });
  const [selectedExistingClass, setSelectedExistingClass] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  const unsavedChanges = useUnsavedChanges();

  // Sync internal state when initialData prop changes
  useEffect(() => {
    setLiveClassData({
      ...DEFAULT_LIVE_CLASS_DATA,
      ...initialData,
    });
    setHasChanges(false);
  }, [initialData]);

  // Determine if fields should be disabled based on status
  const isDisabled = liveClassData.classStatus === 'ongoing' || liveClassData.classStatus === 'completed';
  const showSaveButton = !isDisabled;

  // Handle input changes
  const handleInputChange = (field: keyof LiveClassData, value: any) => {
    setLiveClassData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    unsavedChanges.markAsUnsaved();
  };

  // Handle mode change (new vs existing)
  const handleModeChange = (newMode: LiveClassMode) => {
    handleInputChange('mode', newMode);
    setSelectedExistingClass('');
  };

  // Handle existing class selection
  const handleExistingClassSelect = (classId: string) => {
    setSelectedExistingClass(classId);
    const existingClass = MOCK_EXISTING_CLASSES.find(c => c.id === classId);
    if (existingClass) {
      setLiveClassData(prev => ({
        ...prev,
        existingClassId: classId,
        title: existingClass.title,
        batchName: existingClass.batchName,
      }));
      setHasChanges(true);
      unsavedChanges.markAsUnsaved();
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    handleInputChange('startDate', date);
  };

  // Auto-generate meeting link on save (mock)
  const generateMeetingLink = () => {
    const platform = liveClassData.meetingPlatform || 'zoom';
    const mockMeetingId = Math.floor(100000000 + Math.random() * 900000000).toString();
    const mockPassword = Math.random().toString(36).substring(2, 8).toUpperCase();

    let mockUrl = '';
    if (platform === 'zoom') {
      mockUrl = `https://zoom.us/j/${mockMeetingId}`;
    } else {
      mockUrl = `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`;
    }

    return {
      meetingUrl: mockUrl,
      meetingId: mockMeetingId,
      meetingPassword: mockPassword,
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Generate meeting link if it doesn't exist
      let finalData = { ...liveClassData };

      if (liveClassData.mode === 'new' && !liveClassData.meetingUrl) {
        const meetingData = generateMeetingLink();
        finalData = { ...finalData, ...meetingData };
      }

      onSave(finalData as LiveClassData);
      setHasChanges(false);
      unsavedChanges.markAsSaved();
    } catch (error) {
      console.error('Error saving live class:', error);
    }
  };

  // Handle cancel with unsaved changes check
  const handleCancel = () => {
    if (unsavedChanges.hasUnsavedChanges) {
      unsavedChanges.attemptAction(onCancel);
    } else {
      onCancel();
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: LiveClassStatus) => {
    switch (status) {
      case 'upcoming':
        return (
          <Badge className="bg-primary-light text-primary border-primary">
            Upcoming
          </Badge>
        );
      case 'ongoing':
        return (
          <Badge className="bg-secondary-light text-secondary border-secondary">
            Ongoing
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-success-light text-success border-success">
            Completed
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b bg-background shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">
            {liveClassData.title || 'Untitled Live Class'}
          </h2>
          {liveClassData.classStatus && getStatusBadge(liveClassData.classStatus)}
        </div>
        {showSaveButton && (
          <Button onClick={handleSubmit} disabled={!hasChanges}>
            Save Live Class
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {/* Mode Selection - Only for creating new or upcoming status */}
            {!isDisabled && (
              <div className="space-y-3">
                <Label>Class Type</Label>
                <RadioGroup
                  value={liveClassData.mode || 'new'}
                  onValueChange={(value) => handleModeChange(value as LiveClassMode)}
                  disabled={isDisabled}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new-class" />
                    <Label htmlFor="new-class" className="font-normal cursor-pointer">
                      New Live Class
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing-class" />
                    <Label htmlFor="existing-class" className="font-normal cursor-pointer">
                      Select from Existing Classes
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Existing Classes List */}
            {liveClassData.mode === 'existing' && !isDisabled && (
              <div className="space-y-3">
                <Label>Available Classes</Label>
                <RadioGroup
                  value={selectedExistingClass}
                  onValueChange={handleExistingClassSelect}
                >
                  <div className="space-y-2">
                    {MOCK_EXISTING_CLASSES.map((existingClass) => (
                      <div
                        key={existingClass.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-colors",
                          selectedExistingClass === existingClass.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem
                            value={existingClass.id}
                            id={existingClass.id}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={existingClass.id}
                              className="font-medium cursor-pointer"
                            >
                              {existingClass.title}
                            </Label>
                            <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                              <span>{existingClass.date}</span>
                              <span>•</span>
                              <span>{existingClass.batchName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* New Live Class Form */}
            {liveClassData.mode === 'new' && (
              <>
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={liveClassData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter live class title"
                    disabled={isDisabled}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={liveClassData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter live class description"
                    className="min-h-[100px]"
                    disabled={isDisabled}
                  />
                </div>

                {/* Date, Start Time, and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={isDisabled}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !liveClassData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {liveClassData.startDate ? (
                            format(liveClassData.startDate, "MMM d, yyyy")
                          ) : (
                            <span>Select a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={liveClassData.startDate}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Start Time */}
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={liveClassData.startTime || ''}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      disabled={isDisabled}
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="15"
                      max="480"
                      step="15"
                      value={liveClassData.duration || 90}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                      placeholder="90"
                      disabled={isDisabled}
                    />
                  </div>
                </div>

                {/* Meeting Platform Selection */}
                <div className="space-y-3">
                  <Label>Meeting Platform</Label>
                  <RadioGroup
                    value={liveClassData.meetingPlatform || 'zoom'}
                    onValueChange={(value) => handleInputChange('meetingPlatform', value as MeetingPlatform)}
                    disabled={isDisabled}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="zoom" id="zoom" />
                      <Label htmlFor="zoom" className="font-normal cursor-pointer">
                        Zoom
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="google-meet" id="google-meet" />
                      <Label htmlFor="google-meet" className="font-normal cursor-pointer">
                        Google Meet
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Meeting Link Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {liveClassData.meetingPlatform === 'zoom' ? 'Zoom' : 'Google Meet'} Meeting Integration
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        A {liveClassData.meetingPlatform === 'zoom' ? 'Zoom' : 'Google Meet'} class link will be generated and emailed to everyone automatically when you save this live class.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meeting Link Preview (after saving) */}
                {liveClassData.meetingUrl && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-green-800">
                      <span className="text-sm font-medium">Meeting Link Generated</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs font-semibold text-green-900">Meeting URL</Label>
                        <div className="text-sm text-blue-600 mt-1">
                          <a href={liveClassData.meetingUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {liveClassData.meetingUrl}
                          </a>
                        </div>
                      </div>
                      {liveClassData.meetingPlatform === 'zoom' && (
                        <>
                          <div>
                            <Label className="text-xs font-semibold text-green-900">Meeting ID</Label>
                            <div className="text-sm font-mono text-green-800 mt-1">{liveClassData.meetingId}</div>
                          </div>
                          <div>
                            <Label className="text-xs font-semibold text-green-900">Password</Label>
                            <div className="text-sm font-mono text-green-800 mt-1">{liveClassData.meetingPassword}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Class Recording - Only shown for completed classes */}
            {liveClassData.classStatus === 'completed' && liveClassData.recordingUrl && (
              <div className="space-y-4 mt-8">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Class Recording</h3>

                  {liveClassData.recordingPlatform === 'youtube' ? (
                    // YouTube iframe player
                    <div className="aspect-video w-full rounded-lg overflow-hidden border">
                      <iframe
                        src={liveClassData.recordingUrl.includes('embed')
                          ? liveClassData.recordingUrl
                          : `https://www.youtube.com/embed/${liveClassData.recordingUrl.split('v=')[1]?.split('&')[0] || ''}`
                        }
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Class Recording"
                      />
                    </div>
                  ) : (
                    // HTML5 video player for uploads
                    <div className="w-full">
                      <video
                        src={liveClassData.recordingUrl}
                        className="w-full rounded-lg border"
                        controls
                        controlsList="nodownload"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={unsavedChanges.showWarningModal}
        onClose={unsavedChanges.closeModal}
        onDiscard={unsavedChanges.discardChanges}
        onSave={() => unsavedChanges.saveAndContinue(handleSubmit)}
      />
    </div>
  );
}
