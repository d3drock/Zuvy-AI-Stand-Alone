'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, Plus, Upload, Eye, UserCheck, Calendar, Mail, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface BatchesTabProps {
  courseId: string;
}

interface Batch {
  id: string;
  name: string;
  instructorEmail: string;
  capEnrollment: number;
  studentCount: number;
  status: 'not_started' | 'ongoing' | 'completed';
  startDate?: string;
  endDate?: string;
  createdDate: string;
}

interface NewBatchData {
  name: string;
  instructorEmail: string;
  capEnrollment: string;
}

const mockBatches: Batch[] = [
  {
    id: '1',
    name: 'Full Stack Batch 2024-A',
    instructorEmail: 'john.doe@example.com',
    capEnrollment: 25,
    studentCount: 23,
    status: 'ongoing',
    startDate: '2024-01-15',
    endDate: '2024-04-15',
    createdDate: '2024-01-10'
  },
  {
    id: '2',
    name: 'Full Stack Batch 2024-B',
    instructorEmail: 'jane.smith@example.com',
    capEnrollment: 30,
    studentCount: 25,
    status: 'ongoing',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    createdDate: '2024-01-25'
  }
];

const BatchesTab = ({ courseId }: BatchesTabProps) => {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [newBatchData, setNewBatchData] = useState<NewBatchData>({
    name: '',
    instructorEmail: '',
    capEnrollment: ''
  });
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-success-light text-success-dark border-success';
      case 'not_started':
        return 'bg-warning-light text-warning-dark border-warning';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleCreateBatch = () => {
    setIsCreateModalOpen(true);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleFinishBatch = () => {
    console.log('Creating batch:', newBatchData);
    setIsCreateModalOpen(false);
    setCurrentStep(1);
    setNewBatchData({
      name: '',
      instructorEmail: '',
      capEnrollment: ''
    });
  };

  const handleViewStudents = (batchId: string) => {
    // Navigate directly to the batch details page
    router.push(`/courses/${courseId}/batches/${batchId}`);
  };

  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setNewBatchData({
      name: batch.name,
      instructorEmail: batch.instructorEmail,
      capEnrollment: batch.capEnrollment.toString()
    });
    setIsEditModalOpen(true);
    setCurrentStep(1);
  };

  const handleUpdateBatch = () => {
    if (editingBatch) {
      setBatches(prev => prev.map(batch => 
        batch.id === editingBatch.id 
          ? { ...batch, ...newBatchData, capEnrollment: parseInt(newBatchData.capEnrollment) }
          : batch
      ));
      setIsEditModalOpen(false);
      setEditingBatch(null);
      setNewBatchData({
        name: '',
        instructorEmail: '',
        capEnrollment: ''
      });
    }
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold">Batches</h2>
          <p className="text-muted-foreground">
            Organize students into batches for better management
          </p>
        </div>
        <Button 
          onClick={handleCreateBatch}
          className="bg-primary hover:bg-primary-dark shadow-4dp"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Batch
        </Button>
      </div>

      {/* Batch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="hover:shadow-hover transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold mb-2">
                    {batch.name}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`capitalize text-xs ${getStatusColor(batch.status)}`}
                  >
                    {batch.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary hover:text-white"
                  onClick={() => handleEditBatch(batch)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Instructor:</span>
                <span>{batch.instructorEmail}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Students:</span>
                <span>{batch.studentCount}/{batch.capEnrollment}</span>
              </div>

              {batch.startDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{batch.startDate} - {batch.endDate}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewStudents(batch.id)}
                className="w-full h-10"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Students
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create Batch Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Create New Batch - Step {currentStep} of 2
            </DialogTitle>
            <DialogDescription>
              {currentStep === 1 
                ? "Set up your batch details and instructor information."
                : "Add students to your batch via CSV upload."
              }
            </DialogDescription>
          </DialogHeader>
          
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchName" className="font-semibold">Batch Name *</Label>
                <Input
                  id="batchName"
                  value={newBatchData.name}
                  onChange={(e) => setNewBatchData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter batch name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorEmail" className="font-semibold">Instructor Email *</Label>
                <Input
                  id="instructorEmail"
                  type="email"
                  value={newBatchData.instructorEmail}
                  onChange={(e) => setNewBatchData(prev => ({ ...prev, instructorEmail: e.target.value }))}
                  placeholder="Enter instructor email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capEnrollment" className="font-semibold">Cap Enrollment *</Label>
                <Input
                  id="capEnrollment"
                  type="number"
                  min="1"
                  value={newBatchData.capEnrollment}
                  onChange={(e) => setNewBatchData(prev => ({ ...prev, capEnrollment: e.target.value }))}
                  placeholder="Maximum number of students"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNextStep} className="bg-primary hover:bg-primary-dark">
                  Next: Add Students
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a CSV file with student information
                  </p>
                  <Button variant="secondary" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Select CSV File
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button variant="ghost" size="sm">
                    Download Sample CSV
                  </Button>
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Previous
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFinishBatch} className="bg-primary hover:bg-primary-dark">
                    Create Batch
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Batch Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Edit Batch - {editingBatch?.name}
            </DialogTitle>
            <DialogDescription>
              Update batch details and instructor information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editBatchName" className="font-semibold">Batch Name *</Label>
              <Input
                id="editBatchName"
                value={newBatchData.name}
                onChange={(e) => setNewBatchData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter batch name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editInstructorEmail" className="font-semibold">Instructor Email *</Label>
              <Input
                id="editInstructorEmail"
                type="email"
                value={newBatchData.instructorEmail}
                onChange={(e) => setNewBatchData(prev => ({ ...prev, instructorEmail: e.target.value }))}
                placeholder="Enter instructor email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCapEnrollment" className="font-semibold">Cap Enrollment *</Label>
              <Input
                id="editCapEnrollment"
                type="number"
                min="1"
                value={newBatchData.capEnrollment}
                onChange={(e) => setNewBatchData(prev => ({ ...prev, capEnrollment: e.target.value }))}
                placeholder="Maximum number of students"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBatch} className="bg-primary hover:bg-primary-dark">
                Update Batch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchesTab;