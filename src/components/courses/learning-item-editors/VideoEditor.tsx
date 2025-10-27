'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { FileUp, Link, Video, Upload, ExternalLink } from 'lucide-react';
import { useUnsavedChanges } from '../curriculum/useUnsavedChanges';
import { UnsavedChangesModal } from '../curriculum/UnsavedChangesModal';

// Define the video source types
type VideoSourceType = 'upload' | 'youtube';

// Define the video data structure
export interface VideoData {
  id?: string;
  title: string;
  description?: string;
  sourceType: VideoSourceType;
  url?: string;
  fileUrl?: string;
  transcript?: string;
  transcriptFile?: File;
}

interface VideoEditorProps {
  initialData?: VideoData;
  mode: 'create' | 'edit';
  onSave: (data: VideoData) => void;
  onCancel: () => void;
}

const DEFAULT_VIDEO_DATA: VideoData = {
  title: '',
  description: '',
  sourceType: 'youtube',
};

/**
 * VideoEditor
 * 
 * Editor component for creating and editing videos.
 * Supports video uploads and YouTube URLs.
 */
export function VideoEditor({
  initialData = DEFAULT_VIDEO_DATA,
  mode,
  onSave,
  onCancel,
}: VideoEditorProps) {
  const [videoData, setVideoData] = useState<VideoData>(initialData);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.url || null);

  const unsavedChanges = useUnsavedChanges();

  // Handle input changes
  const handleInputChange = (field: keyof VideoData, value: any) => {
    setVideoData(prev => ({ ...prev, [field]: value }));
    unsavedChanges.markAsUnsaved();
  };

  // Watch for data changes to mark as unsaved
  useEffect(() => {
    const hasChanges = JSON.stringify(videoData) !== JSON.stringify(initialData);
    if (hasChanges) {
      unsavedChanges.markAsUnsaved();
    }
  }, [videoData, initialData]);
  
  // Handle source type change
  const handleSourceTypeChange = (value: VideoSourceType) => {
    setVideoData(prev => ({ ...prev, sourceType: value }));
    setPreviewUrl(null); // Reset preview when source type changes
  };
  
  // Handle file upload with proper file handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid video file (MP4, MOV, AVI, WMV)');
        return;
      }

      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('File size must be less than 50MB');
        return;
      }

      // Create object URL for preview
      const fileUrl = URL.createObjectURL(file);
      handleInputChange('fileUrl', fileUrl);
      setPreviewUrl(fileUrl);

      console.log('Video file uploaded:', file.name, file.size, file.type);
    }
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    document.getElementById('video-file-upload')?.click();
  };
  
  // Handle URL preview
  const handleUrlPreview = () => {
    if (videoData.url) {
      setPreviewUrl(videoData.url);
    }
  };
  
  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  
  // Generate embed URL for YouTube
  const getEmbedUrl = (): string | null => {
    if (!videoData.url) return null;
    
    if (videoData.sourceType === 'youtube') {
      const videoId = extractVideoId(videoData.url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    return videoData.url;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      onSave(videoData);
      unsavedChanges.markAsSaved();
    } catch (error) {
      console.error('Error saving video:', error);
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

  // Handle URL change with validation
  const handleUrlChange = (url: string) => {
    handleInputChange('url', url);

    if (url && videoData.sourceType === 'youtube') {
      // Validate YouTube URL
      const videoId = extractVideoId(url);
      if (videoId) {
        setPreviewUrl(url);
      } else if (url.length > 10) {
        // Only show error for non-empty URLs that don't match
        console.warn('Invalid YouTube URL format');
      }
    }
  };

  // Handle transcript file upload
  const handleTranscriptFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('transcriptFile', file);
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('transcript', e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
          {/* Title - Underlined style as per design specs */}
          <div className="space-y-3">
            <input
              type="text"
              value={videoData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Video Title"
              className="text-xl font-semibold bg-transparent border-none outline-none border-b-2 border-border focus:border-primary transition-colors w-full pb-1"
              style={{ fontSize: '1.25rem' }} // h5 size as per specs
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={videoData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter video description"
              className="min-h-[100px]"
            />
          </div>

          {/* Video Source Selection */}
          <div className="space-y-4">
            <Label>Video Source</Label>
            <RadioGroup
              value={videoData.sourceType}
              onValueChange={(value) => handleSourceTypeChange(value as VideoSourceType)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="youtube" id="youtube" />
                <Label htmlFor="youtube" className="cursor-pointer">YouTube</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="cursor-pointer">Direct Upload</Label>
              </div>
            </RadioGroup>
          </div>

          {/* YouTube URL Input with Bookmark Preview */}
          {videoData.sourceType === 'youtube' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="url">YouTube URL</Label>
                <div className="mt-2">
                  <Input
                    id="url"
                    type="url"
                    value={videoData.url || ''}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* YouTube Bookmark Preview */}
              {videoData.url && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-red-600 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{videoData.title || 'YouTube Video'}</h4>
                      <p className="text-xs text-muted-foreground">youtube.com</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{videoData.url}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Upload Area */}
          {videoData.sourceType === 'upload' && (
            <div className="space-y-2">
              <Label>Upload Video File</Label>
              <input
                type="file"
                accept="video/mp4,video/mov,video/avi,video/wmv,video/quicktime"
                onChange={handleFileUpload}
                className="hidden"
                id="video-file-upload"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Drag and drop or click to upload a video file</p>
                  <p className="text-xs text-gray-500">Supported formats: MP4, MOV, AVI, WMV (Max 50MB)</p>
                  <Button variant="outline" onClick={triggerFileUpload} className="mt-3">
                    <FileUp className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
              {videoData.fileUrl && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ Video uploaded successfully</p>
                  <div className="mt-2">
                    <video
                      src={videoData.fileUrl}
                      className="w-full max-w-sm h-32 object-cover rounded border"
                      controls
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transcript Upload (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="transcript">
              Transcript <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Upload transcript file</p>
                <p className="text-xs text-gray-500">Supported formats: TXT, SRT, VTT</p>
                <input
                  type="file"
                  accept=".txt,.srt,.vtt"
                  onChange={handleTranscriptFileUpload}
                  className="hidden"
                  id="transcript-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('transcript-upload')?.click()}
                  className="mt-2"
                >
                  Choose File
                </Button>
              </div>
            </div>
            {videoData.transcript && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">✓ Transcript uploaded successfully</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Footer with CTA buttons */}
      <div className="flex justify-between items-center p-6 border-t bg-background sticky bottom-0">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {mode === 'create' ? 'Add Video' : 'Edit Video'}
        </Button>
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