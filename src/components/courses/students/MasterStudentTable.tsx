'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, MoreVertical, UserMinus, UserX, Mail, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DataTable from '@/components/shared/DataTable';

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  progress: number;
  lastActive: string;
  batch: string | null;
  status: 'active' | 'dropout' | 'graduated';
  attendance: string;
  profilePicture?: string;
}

interface BatchStatus {
  id: string;
  name: string;
  status: 'Not Started' | 'Ongoing' | 'Completed';
}

interface MasterStudentTableProps {
  students: Student[];
  batches: BatchStatus[];
  onDeleteStudent: (studentId: string) => void;
  onDropoutStudent: (studentId: string) => void;
  onEditStudent: (studentId: string) => void;
  onContactStudent: (studentId: string) => void;
  onBatchChange: (studentId: string, newBatch: string | null) => void;
  selectedStudents?: string[];
  onSelectStudent?: (studentId: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  showMultiSelect?: boolean;
  onStudentClick?: (studentId: string) => void;
  totalClasses?: number; // New prop for dynamic attendance column
  hideBatchColumn?: boolean; // Hide batch column for batch detail pages
}

const MasterStudentTable = ({
  students,
  batches,
  onDeleteStudent,
  onDropoutStudent,
  onEditStudent,
  onContactStudent,
  onBatchChange,
  selectedStudents = [],
  onSelectStudent,
  onSelectAll,
  showMultiSelect = false,
  onStudentClick,
  totalClasses = 20, // Default to 20 classes
  hideBatchColumn = false
}: MasterStudentTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dropoutDialogOpen, setDropoutDialogOpen] = useState(false);
  const [batchChangeDialogOpen, setBatchChangeDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  const [pendingBatchChange, setPendingBatchChange] = useState<{
    studentId: string;
    currentBatch: string | null;
    newBatch: string | null;
  } | null>(null);

  // Check if a student can be deleted (only if batch hasn't started)
  const canDeleteStudent = (student: Student): boolean => {
    if (!student.batch) return true; // Not assigned to a batch

    const batch = batches.find(b => b.name === student.batch);
    return batch ? batch.status === 'Not Started' : true;
  };

  // Get student initials for avatar fallback
  const getStudentInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle student action selection
  const handleStudentAction = (action: 'delete' | 'dropout' | 'edit' | 'contact', student: Student) => {
    setSelectedStudentId(student.id);
    setSelectedStudentName(student.name);
    
    if (action === 'delete') {
      setDeleteDialogOpen(true);
    } else if (action === 'dropout') {
      setDropoutDialogOpen(true);
    } else if (action === 'edit') {
      onEditStudent(student.id);
    } else if (action === 'contact') {
      onContactStudent(student.id);
    }
  };

  // Confirm student deletion
  const confirmDelete = () => {
    if (selectedStudentId) {
      onDeleteStudent(selectedStudentId);
      setDeleteDialogOpen(false);
      setSelectedStudentId(null);
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

  // Handle batch change
  const handleBatchChange = (studentId: string, newBatch: string | null) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // If student is already assigned to a batch, show confirmation dialog
    if (student.batch && student.batch !== newBatch) {
      setPendingBatchChange({
        studentId,
        currentBatch: student.batch,
        newBatch
      });
      setSelectedStudentName(student.name);
      setBatchChangeDialogOpen(true);
    } else {
      // Direct assignment for unassigned students
      onBatchChange(studentId, newBatch);
    }
  };

  // Confirm batch change
  const confirmBatchChange = () => {
    if (pendingBatchChange) {
      onBatchChange(pendingBatchChange.studentId, pendingBatchChange.newBatch);
      setBatchChangeDialogOpen(false);
      setPendingBatchChange(null);
      setSelectedStudentName('');
    }
  };

  // Format student data for the table
  const formatStudentData = (student: Student) => {
    const canDelete = canDeleteStudent(student);
    const isDropped = student.status === 'dropout';
    const isSelected = selectedStudents.includes(student.id);

    const baseData = {
      ...student,
      name: (
        <div
          className="flex items-center gap-3 cursor-pointer hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onStudentClick?.(student.id);
          }}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.profilePicture} alt={student.name} />
            <AvatarFallback className="text-xs">
              {getStudentInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm leading-tight">{student.name}</span>
            <span className="text-xs text-muted-foreground truncate">{student.email}</span>
          </div>
        </div>
      ),
      email: null, // Hide email column since it's now part of name
      ...(hideBatchColumn ? {} : {
        batch: (
          <div onClick={(e) => e.stopPropagation()}>
            <Select
              value={student.batch || 'unassigned'}
              onValueChange={(value) => handleBatchChange(student.id, value === 'unassigned' ? null : value)}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned" className="pl-3 [&>span:first-child]:hidden">
                  <span className="text-muted-foreground">Unassigned</span>
                </SelectItem>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.name} className="pl-3 [&>span:first-child]:hidden">
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }),
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
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStudentAction('edit', student)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStudentAction('contact', student)}>
                <Mail className="h-4 w-4 mr-2" />
                Contact Student
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isDropped && (
                <DropdownMenuItem
                  onClick={() => handleStudentAction('dropout', student)}
                  className="text-warning"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Mark as Dropout
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => handleStudentAction('delete', student)}
                  className="text-destructive hover:bg-red-500 hover:text-white"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Delete Student
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    };

    // Add checkbox column if multi-select is enabled
    if (showMultiSelect) {
      return {
        select: (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelectStudent?.(student.id, !!checked)}
              aria-label={`Select ${student.name}`}
            />
          </div>
        ),
        ...baseData
      };
    }

    return baseData;
  };

  // Handle select all functionality
  const allSelected = students.length > 0 && selectedStudents.length === students.length;
  const someSelected = selectedStudents.length > 0 && selectedStudents.length < students.length;

  const baseColumns = [
    { key: 'name', label: 'Student Name', className: 'min-w-[200px]' },
    ...(hideBatchColumn ? [] : [{ key: 'batch', label: 'Batch', className: 'min-w-[250px]' }]),
    { key: 'enrolledDate', label: 'Enrolled Date', className: 'min-w-[120px]' },
    { key: 'progress', label: 'Progress', className: 'min-w-[100px]' },
    { key: 'attendance', label: `Attendance (${totalClasses} Classes)`, className: 'min-w-[120px]' },
    { key: 'lastActive', label: 'Last Active', className: 'min-w-[120px]' },
    { key: 'status', label: 'Status', className: 'min-w-[100px]' },
    { key: 'actions', label: 'Actions', sortable: false, className: 'w-[60px]' }
  ];

  // Add checkbox column if multi-select is enabled
  const studentColumns = showMultiSelect ? [
    {
      key: 'select',
      label: 'Select',
      sortable: false,
      className: 'w-[50px]'
    },
    ...baseColumns
  ] : baseColumns;

  return (
    <>
      <div className="overflow-x-auto">
        <DataTable
          data={students.map(formatStudentData)}
          columns={studentColumns}
          searchable={false}
          filterable={false}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Student
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedStudentName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Batch Change Confirmation Dialog */}
      <Dialog open={batchChangeDialogOpen} onOpenChange={setBatchChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Confirm Batch Change
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to change <strong>{selectedStudentName}</strong>'s batch from{' '}
              <strong>{pendingBatchChange?.currentBatch || 'Unassigned'}</strong> to{' '}
              <strong>{pendingBatchChange?.newBatch || 'Unassigned'}</strong>?
              <br /><br />
              This action will move the student to a different batch and may affect their progress tracking.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchChangeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBatchChange}>
              Change Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MasterStudentTable; 