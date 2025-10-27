
'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, Image, Calendar, Trash2 } from 'lucide-react';

interface GeneralDetailsTabProps {
  courseId: string;
}

const GeneralDetailsTab = ({ courseId }: GeneralDetailsTabProps) => {
  const [formData, setFormData] = useState({
    title: 'Full Stack Web Development Bootcamp',
    description: 'Learn modern web development with React, Node.js, and MongoDB. Build real-world projects and deploy them to production.',
    language: 'English',
    startDate: '2024-08-15',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    collaboratorName: '',
    collaboratorLogo: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, collaboratorLogo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, collaboratorLogo: '' }));
  };

  const handleSave = () => {
    console.log('Saving course data:', formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h2 className="font-heading text-xl font-semibold">General Details</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Image */}
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="Course preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary">
                  <Image className="h-12 w-12 text-primary opacity-60" />
                </div>
              )}
            </div>
            
            {/* Image Management Buttons */}
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="w-full pointer-events-none">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              {formData.imageUrl && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="w-full hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold">Course Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter course title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter course description"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="font-semibold">Course Start Date</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Collaborator Section */}
            <div className="space-y-4">
              <Label className="font-semibold">Collaborator Details</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="collaboratorName" className="text-sm">Collaborator Name</Label>
                  <Input
                    id="collaboratorName"
                    value={formData.collaboratorName}
                    onChange={(e) => handleInputChange('collaboratorName', e.target.value)}
                    placeholder="Enter collaborator name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Collaborator Logo</Label>
                  <div className="flex items-center gap-4">
                    {formData.collaboratorLogo && (
                      <div className="w-16 h-16 rounded-lg border bg-muted overflow-hidden">
                        <img
                          src={formData.collaboratorLogo}
                          alt="Collaborator logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <Button variant="outline" size="sm" className="pointer-events-none">
                          <Upload className="h-4 w-4 mr-2" />
                          {formData.collaboratorLogo ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                        <input
                          type="file"
                          accept=".png,.svg,.jpg,.jpeg"
                          onChange={handleLogoUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, SVG, or JPG format. Optional.
                      </p>
                    </div>
                    {formData.collaboratorLogo && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveLogo}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Course Language</Label>
              <RadioGroup
                value={formData.language}
                onValueChange={(value) => handleInputChange('language', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="English" id="english" />
                  <Label htmlFor="english">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Hindi" id="hindi" />
                  <Label htmlFor="hindi">Hindi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Kannada" id="kannada" />
                  <Label htmlFor="kannada">Kannada</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary-dark">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralDetailsTab;
