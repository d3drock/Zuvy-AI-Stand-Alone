'use client';

import { useState } from 'react';
import { ArrowUpDown, Search, Filter, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProficiencyLevel } from '@/types/adaptive-assessment';
import { cn } from '@/lib/utils';

interface StudentPerformance {
  id: string;
  name: string;
  email: string;
  assessmentsCompleted: number;
  averageScore: number;
  proficiencyLevel: ProficiencyLevel;
  lastActivity: string;
  improvementTrend: 'improving' | 'declining' | 'stable';
  needsIntervention: boolean;
}

interface StudentPerformanceTableProps {
  students: StudentPerformance[];
  onViewDetails?: (studentId: string) => void;
}

export function StudentPerformanceTable({
  students,
  onViewDetails,
}: StudentPerformanceTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'activity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProficiency =
      proficiencyFilter === 'all' || student.proficiencyLevel === proficiencyFilter;
    return matchesSearch && matchesProficiency;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'score':
        comparison = a.averageScore - b.averageScore;
        break;
      case 'activity':
        comparison = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getProficiencyBadge = (level: ProficiencyLevel) => {
    switch (level) {
      case 'advanced':
        return <Badge className="bg-green-500">Advanced</Badge>;
      case 'intermediate':
        return <Badge className="bg-blue-500">Intermediate</Badge>;
      case 'basic':
        return <Badge className="bg-yellow-500">Basic</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <span className="text-success">↗ Improving</span>;
      case 'declining':
        return <span className="text-destructive">↘ Declining</span>;
      case 'stable':
        return <span className="text-muted-foreground">→ Stable</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const toggleSort = (field: 'name' | 'score' | 'activity') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-heading text-body1 font-semibold mb-4">
          Student Performance
        </h3>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={proficiencyFilter} onValueChange={setProficiencyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Proficiency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Proficiency</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('name')}
                  className="gap-1 hover:bg-transparent"
                >
                  Student
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">Assessments</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('score')}
                  className="gap-1 hover:bg-transparent"
                >
                  Avg Score
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Proficiency</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('activity')}
                  className="gap-1 hover:bg-transparent"
                >
                  Last Activity
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No students found</p>
                </TableCell>
              </TableRow>
            ) : (
              sortedStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-body2 font-semibold text-primary">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-body2 font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-body2">{student.assessmentsCompleted}</span>
                  </TableCell>
                  <TableCell>
                    <span className={cn('text-body2 font-semibold', getScoreColor(student.averageScore))}>
                      {student.averageScore}%
                    </span>
                  </TableCell>
                  <TableCell>{getProficiencyBadge(student.proficiencyLevel)}</TableCell>
                  <TableCell>
                    <span className="text-body2">{getTrendIcon(student.improvementTrend)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body2 text-muted-foreground">
                      {formatDate(student.lastActivity)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {student.needsIntervention && (
                        <Badge variant="destructive" className="text-xs">
                          Alert
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails?.(student.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-body2 text-muted-foreground">
        Showing {sortedStudents.length} of {students.length} students
      </div>
    </Card>
  );
}
