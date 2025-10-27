'use client'

import { useState, useEffect } from 'react';
import { Role, Action, RoleActionPermission } from '@/types/index';
import { mockRoles, mockActions, mockRoleActionPermissions } from '@/types/mock-rbac-data';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Users, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const ManageRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [permissions, setPermissions] = useState<RoleActionPermission[]>(mockRoleActionPermissions);
  
  // Modal states
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);
  const [isAddPermissionModalOpen, setIsAddPermissionModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isEditActionModalOpen, setIsEditActionModalOpen] = useState(false);
  const [isEditPermissionModalOpen, setIsEditPermissionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form states
  const [newRoleName, setNewRoleName] = useState('');
  const [newActionName, setNewActionName] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('');
  const [newPermissionName, setNewPermissionName] = useState('');
  const [newPermissionDescription, setNewPermissionDescription] = useState('');
  
  // Edit form states
  const [editRoleName, setEditRoleName] = useState('');
  const [editActionName, setEditActionName] = useState('');
  const [editActionDescription, setEditActionDescription] = useState('');
  const [editPermissionName, setEditPermissionName] = useState('');
  const [editPermissionDescription, setEditPermissionDescription] = useState('');
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const handlePermissionChange = (roleId: string, actionId: string, allowed: boolean) => {
    setPermissions(prev => {
      const existingIndex = prev.findIndex(p => p.roleId === roleId && p.actionId === actionId);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], allowed };
        return updated;
      } else {
        return [...prev, {
          roleId,
          actionId,
          allowed,
          scopeType: 'full'
        }];
      }
    });
  };

  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || '');
  const [selectedActionId, setSelectedActionId] = useState<string>('');

  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const selectedAction = actions.find(a => a.id === selectedActionId);
  const roleActions = actions.filter(action => 
    permissions.some(p => p.roleId === selectedRoleId && p.actionId === action.id && p.allowed)
  );

  // Action-specific permissions mapping
  const [actionPermissionsMap, setActionPermissionsMap] = useState<Record<string, Array<{id: string, name: string, description: string, enabled: boolean}>>>({});
  
  // Get permissions for currently selected action
  const actionPermissions = actionPermissionsMap[selectedActionId] || [];

  // Role colors for new roles
  const roleColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];
  
  // Helper functions
  const addNewRole = () => {
    if (!newRoleName.trim()) return;
    
    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: newRoleName as any, // Custom role name, not from UserRole enum
      description: `${newRoleName} role`,
      color: roleColors[roles.length % roleColors.length],
      permissions: [],
      isSystem: false // Custom role, not a system role
    };
    
    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
    setSelectedActionId('');
    setNewRoleName('');
    setIsAddRoleModalOpen(false);
    toast.success(`Role "${newRoleName}" created successfully!`);
  };
  
  const addNewAction = () => {
    if (!newActionName.trim() || !selectedRoleId) return;
    
    const newAction: Action = {
      id: `action_${Date.now()}`,
      name: newActionName as any, // Custom action name, not from ActionType enum
      description: newActionDescription || `${newActionName} action`,
      category: 'Operations' // Use one of the allowed categories
    };
    
    setActions([...actions, newAction]);
    setPermissions([...permissions, {
      roleId: selectedRoleId,
      actionId: newAction.id,
      allowed: true,
      scopeType: 'full'
    }]);
    
    // Initialize empty permissions for the new action
    setActionPermissionsMap(prev => ({
      ...prev,
      [newAction.id]: []
    }));
    
    // Auto-select the new action
    setSelectedActionId(newAction.id);
    
    setNewActionName('');
    setNewActionDescription('');
    setIsAddActionModalOpen(false);
    toast.success(`Action "${newActionName}" added successfully!`);
  };
  
  const addNewPermission = () => {
    if (!newPermissionName.trim() || !selectedActionId) return;
    
    const newPermission = {
      id: `permission_${Date.now()}`,
      name: newPermissionName,
      description: newPermissionDescription || `${newPermissionName} permission`,
      enabled: false
    };
    
    setActionPermissionsMap(prev => ({
      ...prev,
      [selectedActionId]: [...(prev[selectedActionId] || []), newPermission]
    }));
    
    setNewPermissionName('');
    setNewPermissionDescription('');
    setIsAddPermissionModalOpen(false);
    toast.success(`Permission "${newPermissionName}" added successfully!`);
  };
  
  const handleEdit = (item: any, type: 'role' | 'action' | 'permission') => {
    setEditingItem(item);
    
    if (type === 'role') {
      setEditRoleName(item.name);
      setIsEditRoleModalOpen(true);
    } else if (type === 'action') {
      setEditActionName(item.name);
      setEditActionDescription(item.description);
      setIsEditActionModalOpen(true);
    } else if (type === 'permission') {
      setEditPermissionName(item.name);
      setEditPermissionDescription(item.description);
      setIsEditPermissionModalOpen(true);
    }
  };
  
  const saveRoleEdit = () => {
    if (!editRoleName.trim() || !editingItem) return;
    
    setRoles(prev => prev.map(role =>
      role.id === editingItem.id
        ? { ...role, name: editRoleName as any } // Cast custom role name
        : role
    ));
    
    setEditRoleName('');
    setEditingItem(null);
    setIsEditRoleModalOpen(false);
    toast.success(`Role "${editRoleName}" updated successfully!`);
  };
  
  const saveActionEdit = () => {
    if (!editActionName.trim() || !editingItem) return;
    
    setActions(prev => prev.map(action =>
      action.id === editingItem.id
        ? { ...action, name: editActionName as any, description: editActionDescription } // Cast custom action name
        : action
    ));
    
    setEditActionName('');
    setEditActionDescription('');
    setEditingItem(null);
    setIsEditActionModalOpen(false);
    toast.success(`Action "${editActionName}" updated successfully!`);
  };
  
  const savePermissionEdit = () => {
    if (!editPermissionName.trim() || !editingItem || !selectedActionId) return;
    
    setActionPermissionsMap(prev => ({
      ...prev,
      [selectedActionId]: (prev[selectedActionId] || []).map(permission =>
        permission.id === editingItem.id
          ? { ...permission, name: editPermissionName, description: editPermissionDescription }
          : permission
      )
    }));
    
    setEditPermissionName('');
    setEditPermissionDescription('');
    setEditingItem(null);
    setIsEditPermissionModalOpen(false);
    toast.success(`Permission "${editPermissionName}" updated successfully!`);
  };

  const handleDelete = (item: any, type: 'role' | 'action' | 'permission') => {
    setDeletingItem({ ...item, type });
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (!deletingItem) return;
    
    if (deletingItem.type === 'permission') {
      setActionPermissionsMap(prev => ({
        ...prev,
        [selectedActionId]: (prev[selectedActionId] || []).filter(p => p.id !== deletingItem.id)
      }));
      toast.success(`Permission "${deletingItem.name}" deleted successfully!`);
    } else if (deletingItem.type === 'action') {
      // Remove the action from actions array
      setActions(prev => prev.filter(a => a.id !== deletingItem.id));
      // Remove related permissions
      setPermissions(prev => prev.filter(p => p.actionId !== deletingItem.id));
      // Remove action permissions from mapping
      setActionPermissionsMap(prev => {
        const updated = { ...prev };
        delete updated[deletingItem.id];
        return updated;
      });
      // Clear selection if this action was selected
      if (selectedActionId === deletingItem.id) {
        setSelectedActionId('');
      }
      toast.success(`Action "${deletingItem.name}" deleted successfully!`);
    } else if (deletingItem.type === 'role') {
      // Remove the role from roles array
      setRoles(prev => prev.filter(r => r.id !== deletingItem.id));
      // Remove related permissions
      setPermissions(prev => prev.filter(p => p.roleId !== deletingItem.id));
      // Switch to first available role if current role is being deleted
      if (selectedRoleId === deletingItem.id) {
        const remainingRoles = roles.filter(r => r.id !== deletingItem.id);
        if (remainingRoles.length > 0) {
          setSelectedRoleId(remainingRoles[0].id);
          setSelectedActionId('');
        }
      }
      toast.success(`Role "${deletingItem.name}" deleted successfully!`);
    }
    
    setDeletingItem(null);
    setIsDeleteModalOpen(false);
  };
  
  const isNewRole = (roleId: string) => {
    return !mockRoles.some(role => role.id === roleId);
  };

  // Auto-select first action when role actions change
  useEffect(() => {
    if (roleActions.length > 0 && !selectedActionId) {
      setSelectedActionId(roleActions[0].id);
    }
  }, [roleActions, selectedActionId]);

  return (
    <div className="w-full">
      {/* Sticky Header and Tabs */}
      <div className="sticky top-0 z-10 bg-background space-y-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Manage Role Functions</h2>
            <p className="text-muted-foreground">
              Configure role permissions and manage system actions
            </p>
          </div>
          <Button onClick={() => setIsAddRoleModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Role
          </Button>
        </div>

        {/* Role Tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRoleId(role.id);
                  setSelectedActionId('');
                }}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  selectedRoleId === role.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                )}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: role.color || '#6366f1' }}
                  />
                  <span>{role.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area with Independent Scrolling */}
      <div className="mt-6">
        {roleActions.length === 0 && isNewRole(selectedRoleId) ? (
          /* Single CTA for Empty Role State */
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center text-muted-foreground">
              <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Add Your First Role Action</p>
              <p className="text-sm mb-6">Get started by adding a role action for this role</p>
              <Button onClick={() => setIsAddActionModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role Action
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-6 h-[calc(100vh-280px)]">
            {/* Left Sidebar - Actions (30%) with Independent Scrolling */}
            <div className="w-[30%] space-y-4 overflow-y-auto pr-2">
            {/* Role Header */}
            <div className="flex items-center justify-between">
              <h6 className="text-base font-semibold text-muted-foreground">{selectedRole?.name}</h6>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEdit(selectedRole, 'role')}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-destructive-light hover:text-destructive"
                  onClick={() => handleDelete(selectedRole, 'role')}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <h6 className="text-base font-semibold">Role Actions</h6>
            </div>
            
            <div className="space-y-2">
              {roleActions.map((action, index) => (
                <div key={action.id} className="group relative">
                  <button
                    onClick={() => setSelectedActionId(action.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors",
                      selectedActionId === action.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted border-border"
                    )}
                  >
                    <div className="font-medium">{action.name}</div>
                    <div className="text-xs opacity-75 mt-1">{action.description}</div>
                  </button>
                  <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-8 w-8 p-0",
                        selectedActionId === action.id && "text-white hover:text-white"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(action, 'action');
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "h-8 w-8 p-0 hover:bg-destructive-light",
                        selectedActionId === action.id ? "text-white hover:text-destructive" : "hover:text-destructive"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(action, 'action');
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Add Action Button at bottom */}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setIsAddActionModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Role Action
              </Button>
            </div>
          </div>

          {/* Right Panel - Permissions (70%) with Independent Scrolling */}
          <div className="flex-1 overflow-y-auto pl-2">
          {selectedAction ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h6 className="text-base font-semibold">Permissions for {selectedAction.name}</h6>
                  <p className="text-sm text-muted-foreground">{selectedAction.description}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsAddPermissionModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Permission
                </Button>
              </div>

              {actionPermissions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No permissions yet</p>
                  <p className="text-sm">Add your first permission for this role action</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {actionPermissions.map((permission) => (
                    <div 
                      key={permission.id} 
                      className="group relative p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setActionPermissionsMap(prev => ({
                          ...prev,
                          [selectedActionId]: (prev[selectedActionId] || []).map(p => 
                            p.id === permission.id ? {...p, enabled: !p.enabled} : p
                          )
                        }));
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={permission.enabled}
                          onCheckedChange={(checked) => {
                            setActionPermissionsMap(prev => ({
                              ...prev,
                              [selectedActionId]: (prev[selectedActionId] || []).map(p => 
                                p.id === permission.id ? {...p, enabled: !!checked} : p
                              )
                            }));
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">{permission.description}</div>
                        </div>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(permission, 'permission');
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-destructive-light hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(permission, 'permission');
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              <div className="text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Action Selected</p>
                <p className="text-sm">Select an action from the left panel to view and manage its permissions</p>
              </div>
            </div>
          )}
          </div>
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      <Dialog open={isAddRoleModalOpen} onOpenChange={setIsAddRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewRole}>
              Add Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Action Modal */}
      <Dialog open={isAddActionModalOpen} onOpenChange={setIsAddActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Role Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="actionName">Action Name</Label>
              <Input
                id="actionName"
                value={newActionName}
                onChange={(e) => setNewActionName(e.target.value)}
                placeholder="Enter action name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionDescription">Description</Label>
              <Textarea
                id="actionDescription"
                value={newActionDescription}
                onChange={(e) => setNewActionDescription(e.target.value)}
                placeholder="Enter action description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddActionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewAction}>
              Add Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Permission Modal */}
      <Dialog open={isAddPermissionModalOpen} onOpenChange={setIsAddPermissionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permissionName">Permission Name</Label>
              <Input
                id="permissionName"
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
                placeholder="Enter permission name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissionDescription">Permission Description</Label>
              <Textarea
                id="permissionDescription"
                value={newPermissionDescription}
                onChange={(e) => setNewPermissionDescription(e.target.value)}
                placeholder="Enter permission description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPermissionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewPermission}>
              Add Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={isEditRoleModalOpen} onOpenChange={setIsEditRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editRoleName">Role Name</Label>
              <Input
                id="editRoleName"
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRoleEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Action Modal */}
      <Dialog open={isEditActionModalOpen} onOpenChange={setIsEditActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editActionName">Action Name</Label>
              <Input
                id="editActionName"
                value={editActionName}
                onChange={(e) => setEditActionName(e.target.value)}
                placeholder="Enter action name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editActionDescription">Description</Label>
              <Textarea
                id="editActionDescription"
                value={editActionDescription}
                onChange={(e) => setEditActionDescription(e.target.value)}
                placeholder="Enter action description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditActionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveActionEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Modal */}
      <Dialog open={isEditPermissionModalOpen} onOpenChange={setIsEditPermissionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editPermissionName">Permission Name</Label>
              <Input
                id="editPermissionName"
                value={editPermissionName}
                onChange={(e) => setEditPermissionName(e.target.value)}
                placeholder="Enter permission name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPermissionDescription">Permission Description</Label>
              <Textarea
                id="editPermissionDescription"
                value={editPermissionDescription}
                onChange={(e) => setEditPermissionDescription(e.target.value)}
                placeholder="Enter permission description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPermissionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePermissionEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete the {deletingItem?.type} "{deletingItem?.name}"? This action cannot be undone.
          </p>
          <DialogFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageRolesPage;