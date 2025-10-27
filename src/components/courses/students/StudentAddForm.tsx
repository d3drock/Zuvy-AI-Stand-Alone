'use client'

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Batch } from './BatchCard';

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  batchId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface StudentAddFormProps {
  batches: Batch[];
  onAddStudent: (student: { name: string; email: string; batchId?: string }) => void;
  onCancel?: () => void;
  editingStudent?: {
    id: string;
    name: string;
    email: string;
    batch: string | null;
  } | null;
  onEditStudent?: (studentId: string, student: { name: string; email: string; batchId?: string }) => void;
}

const StudentAddForm = ({ batches, onAddStudent, onCancel, editingStudent, onEditStudent }: StudentAddFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!editingStudent;

  // Get batch ID from batch name for editing
  const getBatchIdFromName = (batchName: string | null) => {
    if (!batchName) return undefined;
    const batch = batches.find(b => b.name === batchName);
    return batch?.id;
  };

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingStudent?.name || '',
      email: editingStudent?.email || '',
      batchId: getBatchIdFromName(editingStudent?.batch || null),
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && editingStudent && onEditStudent) {
        await onEditStudent(editingStudent.id, {
          name: values.name,
          email: values.email,
          batchId: values.batchId,
        });
      } else {
        await onAddStudent({
          name: values.name,
          email: values.email,
          batchId: values.batchId,
        });
      }
      form.reset();
    } catch (error) {
      console.error(isEditing ? 'Error editing student:' : 'Error adding student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter student's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter student's email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="batchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Batch (Optional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? (isEditing ? 'Updating...' : 'Adding...')
              : (isEditing ? 'Update Student' : 'Add Student')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentAddForm; 