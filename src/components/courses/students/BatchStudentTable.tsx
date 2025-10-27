'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { AlertCircle, MoreVertical, UserMinus, Mail, Eye } from 'lucide-react';
import DataTable from '@/components/shared/DataTable';
import { Student } from './MasterStudentTable';
import { Batch } from './BatchCard';

interface BatchStudentTableProps {
  batch: Batch;
  students: Student[];
  onDropoutStudent: (studentId: string) => void;
  onViewStudent: (studentId: string) => void;
  onContactStudent: (studentId: string) => void;
  onRemoveFromBatch: (studentId: string) => void;
}

const BatchStudentTable = ({
  batch,
  students,
  onDropoutStudent,
  onViewStudent,
  onContactStudent,
  onRemoveFromBatch
}: BatchStudentTableProps) => {
  const [dropoutDialogOpen, setDropoutDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');

  // Handle student action selection
  const handleStudentAction = (action: 'dropout' | 'view' | 'contact' | 'remove', student: Student) => {
    setSelectedStudentId(student.id);
    setSelectedStudentName(student.name);
    
    if (action === 'dropout') {
      setDropoutDialogOpen(true);
    } else if (action === 'view') {
      onViewStudent(student.id);
    } else if (action === 'contact') {
      onContactStudent(student.id);
    } else if (action === 'remove') {
      setRemoveDialogOpen(true);
    }
  };

  // Confirm student dropout
  const confirmDropout = () => {
    if (selectedStudentId) {
      onDropoutStudent(selectedStudentId);
      setDropoutDialogOpen(false);
      setSelectedStudentId(null);
    }
  };

  // Confirm remove from batch
  const confirmRemoveFromBatch = () => {
    if (selectedStudentId) {
      onRemoveFromBatch(selectedStudentId);
      setRemoveDialogOpen(false);
      setSelectedStudentId(null);
    }
  };

  // Format student data for the table
  const formatStudentData = (student: Student) => {
    const isDropped = student.status === 'dropout';
    
    return {
      ...student,
      progress: (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-primary-light rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${student.progress}%` }}
            />
          </div>
          <span className="text-sm">{student.progress}%</span>
        </div>
      ),
      status: (
        <Badge
          variant={
            student.status === 'active' ? 'default' :
            student.status === 'dropout' ? 'destructive' :
            student.status === 'graduated' ? 'accent' :
            'outline'
          }
        >
          {student.status}
        </Badge>
      ),
      actions: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStudentAction('view', student)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStudentAction('contact', student)}>
              <Mail className="h-4 w-4 mr-2" />
              Contact Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!isDropped && batch.status === 'Ongoing' && (
              <DropdownMenuItem 
                onClick={() => handleStudentAction('dropout', student)}
                className="text-warning"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropout
              </DropdownMenuItem>
            )}
            {batch.status === 'Not Started' && (
              <DropdownMenuItem 
                onClick={() => handleStudentAction('remove', student)}
                className="text-destructive"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Remove from Batch
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    };
  };

  const studentColumns = [
    { key: 'name', label: 'Student Name' },
    { key: 'email', label: 'Email' },
    { key: 'enrolledDate', label: 'Enrolled Date' },
    { key: 'progress', label: 'Progress' },
    { key: 'lastActive', label: 'Last Active' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <>
      <Card className="shadow-4dp">
        <CardHeader>
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            {batch.name} - Students
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            data={students.map(formatStudentData)}
            columns={studentColumns}
            searchable
            filterable
          />
        </CardContent>
      </Card>

      {/* Dropout Confirmation Dialog */}
      <Dialog open={dropoutDialogOpen} onOpenChange={setDropoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-warning" />
              Mark as Dropout
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark {selectedStudentName} as dropped out? Their progress data will be preserved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDropoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={confirmDropout}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove from Batch Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Remove from Batch
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedStudentName} from {batch.name}? They will remain enrolled in the course.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveFromBatch}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BatchStudentTable; 