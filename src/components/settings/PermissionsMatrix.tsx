'use client'

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Action, Role, RoleActionPermission } from '@/types/index';
import { mockActions, mockRoles, mockRoleActionPermissions } from '@/types/mock-rbac-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PermissionsMatrixProps {
  roles?: Role[];
  actions?: Action[];
  permissions?: RoleActionPermission[];
  onPermissionChange?: (roleId: string, actionId: string, allowed: boolean) => void;
  className?: string;
}

const PermissionsMatrix = ({
  roles = mockRoles,
  actions = mockActions,
  permissions = mockRoleActionPermissions,
  onPermissionChange,
  className
}: PermissionsMatrixProps) => {
  const [currentPermissions, setCurrentPermissions] = useState<RoleActionPermission[]>(permissions);

  const isPermissionAllowed = (roleId: string, actionId: string): boolean => {
    const permission = currentPermissions.find(
      p => p.roleId === roleId && p.actionId === actionId
    );
    return permission?.allowed || false;
  };

  const getScopeType = (roleId: string, actionId: string): string | undefined => {
    const permission = currentPermissions.find(
      p => p.roleId === roleId && p.actionId === actionId
    );
    return permission?.scopeType;
  };

  const getScopeDescription = (roleId: string, actionId: string): string | undefined => {
    const permission = currentPermissions.find(
      p => p.roleId === roleId && p.actionId === actionId
    );
    return permission?.scopeDescription;
  };

  const handlePermissionToggle = (roleId: string, actionId: string, checked: boolean) => {
    // Update local state
    setCurrentPermissions(prev => {
      const existingIndex = prev.findIndex(p => p.roleId === roleId && p.actionId === actionId);
      
      if (existingIndex >= 0) {
        // Update existing permission
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], allowed: checked };
        return updated;
      } else {
        // Add new permission
        return [...prev, {
          roleId,
          actionId,
          allowed: checked,
          scopeType: 'full'
        }];
      }
    });

    // Call external handler if provided
    onPermissionChange?.(roleId, actionId, checked);

    // Show success toast
    const role = roles.find(r => r.id === roleId);
    const action = actions.find(a => a.id === actionId);
    
    toast.success('Permission updated', {
      description: `${role?.name} ${checked ? 'can now' : 'can no longer'} perform "${action?.name}"`,
      duration: 3000
    });
  };

  const renderPermissionCell = (roleId: string, actionId: string) => {
    const allowed = isPermissionAllowed(roleId, actionId);
    const role = roles.find(r => r.id === roleId);
    
    // Admin has access to everything
    if (role?.name === 'Admin') {
      return (
        <div className="flex items-center justify-center">
          <Badge variant="default" className="bg-green-100 text-green-800">
            Yes
          </Badge>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={allowed}
          onCheckedChange={(checked) => handlePermissionToggle(roleId, actionId, checked as boolean)}
        />
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'User Management':
        return 'bg-red-50 border-red-200';
      case 'Content Management':
        return 'bg-blue-50 border-blue-200';
      case 'Analytics':
        return 'bg-green-50 border-green-200';
      case 'Operations':
        return 'bg-yellow-50 border-yellow-200';
      case 'Support':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Group actions by category
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, Action[]>);

  return (
    <div className={cn("", className)}>
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Action(s)</TableHead>
              {roles.filter(role => role.name === 'Ops' || role.name === 'Instructor').map((role) => (
                <TableHead key={role.id} className="text-center font-semibold">
                  {role.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedActions).map(([category, categoryActions]) => (
              <React.Fragment key={category}>
                {/* Category Header Row */}
                <TableRow key={`category-${category}`} className={cn("", getCategoryColor(category))}>
                  <TableCell colSpan={3} className="font-semibold text-sm py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                      {category}
                      <span className="text-xs text-muted-foreground font-normal">
                        ({categoryActions.length} action{categoryActions.length > 1 ? 's' : ''})
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                {/* Actions in this category */}
                {categoryActions.map((action) => (
                  <TableRow key={action.id} className="hover:bg-primary-light">
                    <TableCell className="font-medium max-w-xs pl-8">
                      <div>
                        <div className="font-medium">{action.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                      </div>
                    </TableCell>
                    {roles.filter(role => role.name === 'Ops' || role.name === 'Instructor').map((role) => (
                      <TableCell key={role.id} className="text-center">
                        {renderPermissionCell(role.id, action.id)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermissionsMatrix;