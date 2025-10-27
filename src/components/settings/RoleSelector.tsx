'use client'

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/index';
import { mockRoles } from '@/types/mock-rbac-data';
import { Shield, Users, Settings, GraduationCap } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole?: UserRole;
  onRoleSelect: (role: UserRole) => void;
  className?: string;
}

const roleIcons = {
  'Admin': Settings,
  'Ops': Users,
  'Instructor': GraduationCap
};

const RoleSelector = ({ selectedRole, onRoleSelect, className }: RoleSelectorProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {mockRoles.map((role) => {
        const Icon = roleIcons[role.name];
        const isSelected = selectedRole === role.name;
        
        return (
          <div
            key={role.id}
            onClick={() => onRoleSelect(role.name)}
            className={cn(
              "relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200",
              "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-sm font-semibold",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {role.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="h-3 w-3 bg-primary rounded-full" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoleSelector;