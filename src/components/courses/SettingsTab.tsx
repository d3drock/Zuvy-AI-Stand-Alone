
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Trash2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SettingsTabProps {
  courseId: string;
}

const SettingsTab = ({ courseId }: SettingsTabProps) => {
  const [settings, setSettings] = useState({
    courseType: 'private',
    moduleLock: true
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Mock course name - in real app this would come from props or API
  const courseName = 'Full Stack Web Development Bootcamp';

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Implementation would save to backend
    setIsSaved(true);

    // Reset the saved indicator after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleDeleteCourse = () => {
    if (deleteConfirmationText === courseName) {
      console.log('Deleting course:', courseId);
      // Implementation would delete course
      setIsDeleteDialogOpen(false);
      setDeleteConfirmationText('');
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteConfirmationText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Course Settings Section */}
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-semibold mb-2">Course Settings</h2>
        </div>

        {/* Course Type */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Course Type</Label>
          <RadioGroup
            value={settings.courseType}
            onValueChange={(value) => handleSettingChange('courseType', value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="font-normal">
                Private - Only invited students can access this course
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="font-normal">
                Public - Anyone with the link can access this course
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Module Lock */}
        <div className="flex items-center justify-between py-4 border-t border-b">
          <div className="space-y-1">
            <Label className="text-base font-medium">Module Lock</Label>
            <p className="text-sm text-muted-foreground">
              If enabled, students must complete modules and projects in sequential order
            </p>
          </div>
          <Switch
            checked={settings.moduleLock}
            onCheckedChange={(value) => handleSettingChange('moduleLock', value)}
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end pt-4">
          {isSaved && (
            <Alert variant="default" className="bg-success-light text-success-dark mr-4 py-2 h-10">
              <Info className="h-4 w-4" />
              <AlertDescription>Settings saved successfully</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary-dark">
            Save Settings
          </Button>
        </div>
      </div>

      {/* Delete Course Section */}
      <div className="space-y-6 pt-8 border-t">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="font-heading text-xl font-semibold text-destructive">Delete Course</h2>
        </div>

        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground flex-1 mr-4">
            Once you delete a course, there is no going back. This will permanently delete the course,
            all its content, student enrollments, and submission data.
          </p>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="bg-destructive hover:bg-destructive-dark">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the course
                  and remove all associated data including student submissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-confirmation" className="text-sm font-medium">
                    Type "{courseName}" to confirm:
                  </Label>
                  <Input
                    id="delete-confirmation"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder={courseName}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDeleteDialog}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteCourse}
                  disabled={deleteConfirmationText !== courseName}
                >
                  Delete Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
