'use client'

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FileSpreadsheet, AlertCircle, Upload, Info, Download, CheckCircle, XCircle } from 'lucide-react';
import { Batch } from './BatchCard';

interface UploadProgress {
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  failedRows?: Array<{
    row: number;
    data: Record<string, any>;
    errors: string[];
  }>;
}

interface StudentBulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batches: Batch[];
  onUpload: (data: {
    file: File;
    fileType: 'csv' | 'excel' | 'sheets';
  }) => Promise<void>;
}

const StudentBulkUploadModal = ({
  open,
  onOpenChange,
  batches,
  onUpload
}: StudentBulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'csv' | 'excel' | 'sheets'>('csv');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  // Reset form when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFile(null);
      setFileType('csv');
      setError(null);
      setUploadProgress(null);
      setShowProgress(false);
    }
    onOpenChange(open);
  };

  // Simulate upload progress (in real app this would come from API)
  const simulateProgress = async (): Promise<UploadProgress> => {
    const totalRecords = Math.floor(Math.random() * 50) + 10; // 10-60 records
    let processedRecords = 0;
    let successfulRecords = 0;
    let failedRecords = 0;
    const failedRows: Array<{ row: number; data: Record<string, any>; errors: string[] }> = [];

    // Reset progress
    setUploadProgress({
      totalRecords,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      failedRows: []
    });

    // Simulate processing each record
    for (let i = 0; i < totalRecords; i++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay

      processedRecords++;

      // Simulate some failed records (20% chance)
      if (Math.random() < 0.2) {
        failedRecords++;
        failedRows.push({
          row: i + 2, // +2 because CSV usually has header + 0-based index
          data: {
            name: `Student ${i + 1}`,
            email: `student${i + 1}@example.com`,
            batch: 'Invalid Batch'
          },
          errors: ['Invalid batch name', 'Email already exists']
        });
      } else {
        successfulRecords++;
      }

      // Update progress
      setUploadProgress({
        totalRecords,
        processedRecords,
        successfulRecords,
        failedRecords,
        failedRows
      });
    }

    return {
      totalRecords,
      processedRecords,
      successfulRecords,
      failedRecords,
      failedRows
    };
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const csvContent = `Name,Email,Batch
John Doe,john.doe@example.com,Full Stack Batch 2024-A
Jane Smith,jane.smith@example.com,Full Stack Batch 2024-B
Bob Johnson,bob.johnson@example.com,`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-upload-sample.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Download failed records CSV
  const downloadFailedRecords = () => {
    if (!uploadProgress?.failedRows?.length) return;

    const headers = ['Row', 'Name', 'Email', 'Batch', 'Errors'];
    const csvRows = [
      headers.join(','),
      ...uploadProgress.failedRows.map(row => [
        row.row,
        row.data.name || '',
        row.data.email || '',
        row.data.batch || '',
        row.errors.join('; ')
      ].map(field => `"${field}"`).join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'failed-student-records.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Auto-detect file type
      if (file.name.endsWith('.csv')) {
        setFileType('csv');
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setFileType('excel');
      }
    }
  };


  // Handle upload
  const handleUpload = async () => {
    setError(null);
    setIsUploading(true);
    setShowProgress(true);

    try {
      if (!selectedFile) {
        throw new Error('Please select a file to upload');
      }

      // Simulate the upload progress
      const finalProgress = await simulateProgress();

      // Call the original upload handler
      await onUpload({
        file: selectedFile,
        fileType
      });

      // Don't close modal immediately - let user see results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      setShowProgress(false);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle adding students after successful upload
  const handleAddStudents = () => {
    handleOpenChange(false);
  };

  const progressPercentage = uploadProgress
    ? (uploadProgress.processedRecords / uploadProgress.totalRecords) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Upload Students
          </DialogTitle>
          <DialogDescription>
            Upload multiple students at once using a spreadsheet file or URL.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!showProgress ? (
            <>
              {/* Upload Area */}
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files?.[0]) {
                      handleFileChange({ target: { files } } as any);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('bulk-file-upload')?.click()}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Upload Student Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="bulk-file-upload"
                  />
                  {selectedFile && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>

                {/* Sample CSV Download */}
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadSampleCSV}
                    className="text-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample CSV
                  </Button>
                </div>
              </div>

            </>
          ) : (
            <>
              {/* Progress Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Processing Records</h3>
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress?.processedRecords || 0} of {uploadProgress?.totalRecords || 0} records processed
                  </p>
                </div>

                <Progress value={progressPercentage} className="w-full h-2" />

                {uploadProgress && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Successful: {uploadProgress.successfulRecords}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Failed: {uploadProgress.failedRecords}</span>
                    </div>
                  </div>
                )}

                {uploadProgress?.failedRecords > 0 && !isUploading && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Some records failed to upload</AlertTitle>
                    <AlertDescription className="mt-2">
                      {uploadProgress.failedRecords} out of {uploadProgress.totalRecords} records failed.
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadFailedRecords}
                        className="ml-2 h-auto p-0 text-red-600 hover:text-red-800"
                      >
                        Download failed records
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showProgress && (
            <Alert variant="default" className="bg-card">
              <Info className="h-4 w-4" />
              <AlertTitle>Required Format</AlertTitle>
              <AlertDescription className="text-xs">
                Your CSV should have 'Name' and 'Email' columns (required). Optional 'Batch' column for automatic assignment.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {!showProgress ? (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? 'Processing...' : 'Upload Students'}
              </Button>
            </>
          ) : (
            <>
              {uploadProgress && uploadProgress.processedRecords === uploadProgress.totalRecords && (
                <Button
                  onClick={handleAddStudents}
                  className="bg-primary hover:bg-primary-dark ml-auto"
                >
                  Add Students
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentBulkUploadModal; 