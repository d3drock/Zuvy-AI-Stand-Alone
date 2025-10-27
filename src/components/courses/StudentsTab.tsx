
'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, UserPlus, FileSpreadsheet, Search, Trash2, UserMinus, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import our new components
import MasterStudentTable, { Student } from './students/MasterStudentTable';
import { Batch } from './students/BatchCard';
import StudentAddForm from './students/StudentAddForm';
import StudentBulkUploadModal from './students/StudentBulkUploadModal';

interface StudentsTabProps {
  courseId: string;
  initialBatchFilter?: string | null;
}

// Generate 50 students with realistic data
const generateMockStudents = (): Student[] => {
  const firstNames = ['John', 'Jane', 'Bob', 'Sarah', 'Mike', 'Lisa', 'David', 'Emma', 'Alex', 'Maria', 'Chris', 'Anna', 'Tom', 'Lucy', 'Sam', 'Kate', 'Mark', 'Eva', 'Paul', 'Nina'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const statuses = ['active', 'dropout', 'graduated'] as const;
  const batches = ['Full Stack Batch 2024-A', 'Full Stack Batch 2024-B', null];
  
  return Array.from({ length: 50 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const batch = batches[Math.floor(Math.random() * batches.length)];
    const enrolledDate = new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0];
    const attendance = Math.floor(Math.random() * 20) + 1; // out of 20 classes
    const attendancePercentage = Math.round((attendance / 20) * 100);
    
    return {
      id: `student-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      enrolledDate,
      progress: Math.floor(Math.random() * 100),
      lastActive: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
      batch,
      status,
      attendance: `${attendance} (${attendancePercentage}%)`
    };
  });
};

const StudentsTab = ({ courseId, initialBatchFilter }: StudentsTabProps) => {
  const router = useRouter();

  // State for UI controls
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState(initialBatchFilter || 'all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Multi-select state
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkAssignBatch, setBulkAssignBatch] = useState('');;

  // Mock data - in a real app this would come from an API
  const [students, setStudents] = useState<Student[]>(generateMockStudents());
  
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: 'batch-1',
      name: 'Full Stack Batch 2024-A',
      status: 'Ongoing',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      studentCount: 25
    },
    {
      id: 'batch-2',
      name: 'Full Stack Batch 2024-B',
      status: 'Ongoing',
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      studentCount: 25
    }
  ]);

  // Update batch filter when initialBatchFilter changes
  useEffect(() => {
    if (initialBatchFilter) {
      setBatchFilter(initialBatchFilter);
    }
  }, [initialBatchFilter]);

  // Filtered students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = batchFilter === 'all' || student.batch === batchFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesBatch && matchesStatus;
  });

  // Handler functions
  const handleAddStudent = async (student: { name: string; email: string; batchId?: string }) => {
    // In a real app, this would be an API call
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: student.name,
      email: student.email,
      enrolledDate: new Date().toISOString().split('T')[0],
      progress: 0,
      lastActive: new Date().toISOString().split('T')[0],
      batch: student.batchId ? batches.find(b => b.id === student.batchId)?.name || null : null,
      status: 'active',
      attendance: '0 (0%)'
    };

    setStudents([...students, newStudent]);
    setIsAddStudentModalOpen(false);
  };

  const handleEditStudentSubmit = async (studentId: string, updatedData: { name: string; email: string; batchId?: string }) => {
    // In a real app, this would be an API call
    setStudents(students.map(s =>
      s.id === studentId
        ? {
            ...s,
            name: updatedData.name,
            email: updatedData.email,
            batch: updatedData.batchId ? batches.find(b => b.id === updatedData.batchId)?.name || null : null
          }
        : s
    ));
    setIsEditStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleBulkUpload = async (data: { file: File; fileType: 'csv' | 'excel' | 'sheets' }) => {
    console.log('Bulk upload:', data);
    setIsBulkUploadModalOpen(false);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
  };

  const handleDropoutStudent = (studentId: string) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, status: 'dropout' } : s
    ));
  };

  const handleEditStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setEditingStudent(student);
      setIsEditStudentModalOpen(true);
    }
  };

  const handleContactStudent = (studentId: string) => {
    console.log('Contact student:', studentId);
  };

  const handleStudentClick = (studentId: string) => {
    router.push(`/courses/${courseId}/students/${studentId}`);
  };

  const handleBatchChange = (studentId: string, newBatch: string | null) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, batch: newBatch }
        : student
    ));
    
    const student = students.find(s => s.id === studentId);
    console.log(`Changed ${student?.name}'s batch to:`, newBatch || 'Unassigned');
  };

  // Multi-select handlers
  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleBulkDelete = () => {
    // Only delete students that can be deleted
    const studentsToDelete = selectedStudents.filter(studentId => {
      const student = students.find(s => s.id === studentId);
      return student && (!student.batch || batches.find(b => b.name === student.batch)?.status === 'Not Started' || !student.batch);
    });
    
    setStudents(students.filter(s => !studentsToDelete.includes(s.id)));
    setSelectedStudents([]);
  };

  const handleBulkDropout = () => {
    setStudents(students.map(s => 
      selectedStudents.includes(s.id) ? { ...s, status: 'dropout' } : s
    ));
    setSelectedStudents([]);
  };

  const handleBulkAssignToBatch = () => {
    if (!bulkAssignBatch) return;
    
    const batchName = batches.find(b => b.id === bulkAssignBatch)?.name;
    if (!batchName) return;
    
    setStudents(students.map(s => 
      selectedStudents.includes(s.id) ? { ...s, batch: batchName } : s
    ));
    setSelectedStudents([]);
    setBulkAssignBatch('');
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold">Students</h2>
          <p className="text-muted-foreground">
            Manage student enrollments and track their progress
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <Select value={batchFilter} onValueChange={setBatchFilter}>
          <SelectTrigger className="w-[200px] h-10">
            <SelectValue placeholder="Filter by batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map(batch => (
              <SelectItem key={batch.id} value={batch.name}>{batch.name}</SelectItem>
            ))}
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="dropout">Dropout</SelectItem>
            <SelectItem value="graduated">Graduated</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            className="h-10"
            onClick={() => setIsAddStudentModalOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Single Student
          </Button>
          <Button
            className="bg-primary hover:bg-primary-dark shadow-4dp h-10"
            onClick={() => setIsBulkUploadModalOpen(true)}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar - Show when students are selected - Moved below search */}
      {selectedStudents.length > 0 && (
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Select value={bulkAssignBatch} onValueChange={setBulkAssignBatch}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Assign to batch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {bulkAssignBatch && (
                  <Button size="sm" onClick={handleBulkAssignToBatch}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleBulkDropout}>
                <UserMinus className="h-4 w-4 mr-2" />
                Mark as Dropout
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedStudents([])}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <MasterStudentTable
        students={filteredStudents}
        batches={batches}
        onDeleteStudent={handleDeleteStudent}
        onDropoutStudent={handleDropoutStudent}
        onEditStudent={handleEditStudent}
        onContactStudent={handleContactStudent}
        onBatchChange={handleBatchChange}
        selectedStudents={selectedStudents}
        onSelectStudent={handleSelectStudent}
        onSelectAll={handleSelectAll}
        showMultiSelect={true}
        onStudentClick={handleStudentClick}
        totalClasses={20}
      />

      {/* Add Student Modal */}
      <Dialog open={isAddStudentModalOpen} onOpenChange={setIsAddStudentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Add New Student</DialogTitle>
          </DialogHeader>
          <StudentAddForm
            batches={batches}
            onAddStudent={handleAddStudent}
            onCancel={() => setIsAddStudentModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={isEditStudentModalOpen} onOpenChange={setIsEditStudentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Edit Student</DialogTitle>
          </DialogHeader>
          <StudentAddForm
            batches={batches}
            onAddStudent={handleAddStudent}
            onCancel={() => {
              setIsEditStudentModalOpen(false);
              setEditingStudent(null);
            }}
            editingStudent={editingStudent}
            onEditStudent={handleEditStudentSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <StudentBulkUploadModal 
        open={isBulkUploadModalOpen}
        onOpenChange={setIsBulkUploadModalOpen}
        batches={batches}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default StudentsTab;
