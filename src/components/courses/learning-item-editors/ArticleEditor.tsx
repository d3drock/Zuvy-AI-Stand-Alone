'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { FileUp, Link, FileText, Upload, ExternalLink, Bold, Italic, Underline } from 'lucide-react';
import { useUnsavedChanges } from '../curriculum/useUnsavedChanges';
import { UnsavedChangesModal } from '../curriculum/UnsavedChangesModal';

// Define the article content types
type ArticleContentType = 'rich-text' | 'external-link' | 'upload';

// Define the article data structure
export interface ArticleData {
  id?: string;
  title: string;
  content?: string;
  contentType: ArticleContentType;
  estimatedReadTime?: number;
  externalLink?: string;
  fileUrl?: string;
}

interface ArticleEditorProps {
  initialData?: ArticleData;
  mode: 'create' | 'edit';
  onSave: (data: ArticleData) => void;
  onCancel: () => void;
  hideCancel?: boolean;
}

const DEFAULT_ARTICLE_DATA: ArticleData = {
  title: '',
  content: '',
  contentType: 'rich-text',
};

/**
 * ArticleEditor
 * 
 * Editor component for creating and editing articles.
 * Supports rich text content, external links, and file uploads.
 */
export function ArticleEditor({
  initialData = DEFAULT_ARTICLE_DATA,
  mode,
  onSave,
  onCancel,
  hideCancel = false,
}: ArticleEditorProps) {
  const [articleData, setArticleData] = useState<ArticleData>(initialData);

  const unsavedChanges = useUnsavedChanges();

  // Handle input changes
  const handleInputChange = (field: keyof ArticleData, value: any) => {
    setArticleData(prev => ({ ...prev, [field]: value }));
    unsavedChanges.markAsUnsaved();
  };

  // Watch for data changes to mark as unsaved
  useEffect(() => {
    const hasChanges = JSON.stringify(articleData) !== JSON.stringify(initialData);
    if (hasChanges) {
      unsavedChanges.markAsUnsaved();
    }
  }, [articleData, initialData]);
  
  // Handle content type change
  const handleContentTypeChange = (value: ArticleContentType) => {
    setArticleData(prev => ({ ...prev, contentType: value }));
  };
  
  // Calculate estimated read time based on content length
  const calculateReadTime = () => {
    const wordCount = (articleData.content || '').trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    handleInputChange('estimatedReadTime', readTime);
  };
  
  // Handle PDF file upload with validation
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only');
        return;
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file);
      handleInputChange('fileUrl', fileUrl);

      console.log('PDF file uploaded:', file.name, file.size, file.type);
    }
  };

  // Trigger PDF file upload
  const triggerPDFUpload = () => {
    document.getElementById('pdf-file-upload')?.click();
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      // If it's a rich text article, calculate the read time
      if (articleData.contentType === 'rich-text') {
        calculateReadTime();
      }

      onSave(articleData);
      unsavedChanges.markAsSaved();
    } catch (error) {
      console.error('Error saving article:', error);
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
          {/* Title - Underlined style as per design specs */}
          <div className="space-y-3">
            <input
              type="text"
              value={articleData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Article Title"
              className="text-xl font-semibold bg-transparent border-none outline-none border-b-2 border-border focus:border-primary transition-colors w-full pb-1"
              style={{ fontSize: '1.25rem' }} // h5 size as per specs
            />
          </div>

          {/* Content Type Selection */}
          <div className="space-y-4">
            <Label>Content Type</Label>
            <RadioGroup
              value={articleData.contentType}
              onValueChange={(value) => handleContentTypeChange(value as ArticleContentType)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rich-text" id="rich-text" />
                <Label htmlFor="rich-text" className="cursor-pointer">Rich Text</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="external-link" id="external-link" />
                <Label htmlFor="external-link" className="cursor-pointer">External Link</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload" className="cursor-pointer">Upload PDF</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Rich Text Content */}
          {articleData.contentType === 'rich-text' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Article Content</Label>
                <div className="border rounded-lg">
                  {/* Rich text formatting toolbar */}
                  <div className="flex items-center gap-1 p-3 border-b bg-gray-50">
                    <Button variant="ghost" size="sm" type="button" className="h-8 w-8 p-0">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="h-8 w-8 p-0">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="h-8 w-8 p-0">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-4 bg-border mx-2" />
                    <Button variant="ghost" size="sm" type="button" className="h-8 px-2 text-xs font-semibold">
                      H1
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="h-8 px-2 text-xs font-semibold">
                      H2
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="h-8 px-2 text-xs font-semibold">
                      H3
                    </Button>
                    <div className="w-px h-4 bg-border mx-2" />
                    <Button variant="ghost" size="sm" type="button" className="h-8 px-2 text-xs">
                      • List
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="h-8 px-2 text-xs">
                      1. List
                    </Button>
                    <Button variant="ghost" size="sm" type="button" className="h-8 px-2 text-xs">
                      <Link className="h-3 w-3 mr-1" />
                      Link
                    </Button>
                  </div>
                  <Textarea
                    value={articleData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your article content here... You can use the formatting tools above to style your text."
                    className="min-h-[300px] border-0 resize-none focus-visible:ring-0"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Estimated read time: {articleData.estimatedReadTime || Math.ceil(((articleData.content || '').trim().split(/\s+/).length || 1) / 200)} minute(s)
                </div>
              </div>
            </div>
          )}

          {/* External Link with Bookmark Preview */}
          {articleData.contentType === 'external-link' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="externalLink">Article Link</Label>
                <div className="mt-2">
                  <Input
                    id="externalLink"
                    type="url"
                    value={articleData.externalLink || ''}
                    onChange={(e) => handleInputChange('externalLink', e.target.value)}
                    placeholder="https://example.com/article"
                  />
                </div>
              </div>

              {/* Article Bookmark Preview with Error Handling */}
              {articleData.externalLink && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-blue-600 rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{articleData.title || 'External Article'}</h4>
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          try {
                            return new URL(articleData.externalLink).hostname;
                          } catch {
                            return 'Invalid URL';
                          }
                        })()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{articleData.externalLink}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PDF Upload */}
          {articleData.contentType === 'upload' && (
            <div className="space-y-2">
              <Label>Upload PDF Article</Label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-file-upload"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Drag and drop or click to upload PDF file</p>
                  <p className="text-xs text-gray-500">Supported format: PDF files only (Max 10MB)</p>
                  <Button variant="outline" onClick={triggerPDFUpload} className="mt-3">
                    <FileUp className="h-4 w-4 mr-2" />
                    Choose PDF File
                  </Button>
                </div>
              </div>
              {articleData.fileUrl && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-800 font-medium">✓ PDF uploaded successfully</p>
                      <p className="text-xs text-green-600">Ready for preview</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(articleData.fileUrl, '_blank')}
                    >
                      Preview PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Footer with CTA buttons */}
      <div className="flex justify-between items-center p-6 border-t bg-background sticky bottom-0">
        {!hideCancel && (
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} className={hideCancel ? 'ml-auto' : ''}>
          {mode === 'create' ? 'Add Article' : 'Edit Article'}
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