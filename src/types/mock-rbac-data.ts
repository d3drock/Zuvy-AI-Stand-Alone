import { 
  User, 
  Role, 
  Action, 
  RoleActionPermission, 
  InviteLink,
  UserRole,
  ActionType
} from './index';

// Mock Actions based on the reference image
export const mockActions: Action[] = [
  {
    id: '1',
    name: 'User/Role Management',
    description: 'Manage users and their roles within the platform',
    category: 'User Management'
  },
  {
    id: '2',
    name: 'Create/Edit Roles & Permissions',
    description: 'Create new roles and modify existing role permissions',
    category: 'User Management'
  },
  {
    id: '3',
    name: 'Assign/Revoke Roles',
    description: 'Assign or revoke roles from users',
    category: 'User Management'
  },
  {
    id: '4',
    name: 'Access Review Reminders',
    description: 'Set up and manage access review reminders',
    category: 'Operations'
  },
  {
    id: '5',
    name: 'Create & Schedule Assessments',
    description: 'Create and schedule assessments for courses',
    category: 'Content Management'
  },
  {
    id: '6',
    name: 'View Analytics (Class Response)',
    description: 'View class response analytics and student engagement metrics',
    category: 'Analytics'
  },
  {
    id: '7',
    name: 'Create/Edit Quizzes',
    description: 'Create and edit quiz content',
    category: 'Content Management'
  },
  {
    id: '8',
    name: 'View Individual student grades',
    description: 'View and access individual student grades and performance',
    category: 'Analytics'
  },
  {
    id: '9',
    name: 'Delete/Publish Courses',
    description: 'Delete or publish course content',
    category: 'Content Management'
  },
  {
    id: '10',
    name: 'View Assigned Courses Only',
    description: 'View only courses assigned to the user',
    category: 'Content Management'
  },
  {
    id: '11',
    name: 'Instructor Analytics',
    description: 'View instructor-specific analytics and performance metrics',
    category: 'Analytics'
  },
  {
    id: '12',
    name: 'Student Onboarding',
    description: 'Manage student onboarding processes and workflows',
    category: 'Operations'
  },
  {
    id: '13',
    name: 'Request Technical Support (Self)',
    description: 'Request technical support for platform issues',
    category: 'Support'
  }
];

// Mock Roles with descriptions
export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Users who have full access to all functions of the platform',
    permissions: [],
    isSystem: true,
    color: '#f97316'
  },
  {
    id: '2',
    name: 'Ops',
    description: 'Users who see day to day operations of the courses for Zuvy',
    permissions: [],
    isSystem: true,
    color: '#3b82f6'
  },
  {
    id: '3',
    name: 'Instructor',
    description: 'Users who teach the live classes in the courses and check submissions',
    permissions: [],
    isSystem: true,
    color: '#10b981'
  }
];

// Mock Role-Action Permissions based on the reference image
export const mockRoleActionPermissions: RoleActionPermission[] = [
  // Admin - Has access to everything
  ...mockActions.map(action => ({
    roleId: '1',
    actionId: action.id,
    allowed: true,
    scopeType: 'full' as const
  })),

  // Ops permissions based on reference image
  { roleId: '2', actionId: '5', allowed: true, scopeType: 'full' }, // Create & Schedule Assessments
  { roleId: '2', actionId: '6', allowed: true, scopeType: 'full' }, // View Analytics (Class Response)
  { roleId: '2', actionId: '7', allowed: true, scopeType: 'full' }, // Create/Edit Quizzes
  { roleId: '2', actionId: '8', allowed: true, scopeType: 'full' }, // View Individual student grades
  { roleId: '2', actionId: '10', allowed: true, scopeType: 'full' }, // View Assigned Courses Only
  { roleId: '2', actionId: '12', allowed: true, scopeType: 'full' }, // Student Onboarding
  { roleId: '2', actionId: '13', allowed: true, scopeType: 'full' }, // Request Technical Support (Self)

  // Instructor permissions based on reference image
  { roleId: '3', actionId: '5', allowed: true, scopeType: 'full' }, // Create & Schedule Assessments
  { roleId: '3', actionId: '6', allowed: true, scopeType: 'full' }, // View Analytics (Class Response)
  { roleId: '3', actionId: '7', allowed: true, scopeType: 'full' }, // Create/Edit Quizzes
  { roleId: '3', actionId: '8', allowed: true, scopeType: 'full' }, // View Individual student grades
  { roleId: '3', actionId: '10', allowed: true, scopeType: 'full' }, // View Assigned Courses Only
  { roleId: '3', actionId: '11', allowed: true, scopeType: 'full' }, // Instructor Analytics
  { roleId: '3', actionId: '13', allowed: true, scopeType: 'full' }, // Request Technical Support (Self)
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@zuvy.org',
    role: 'Admin',
    dateAdded: '2024-01-20T14:15:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@zuvy.org',
    role: 'Ops',
    dateAdded: '2024-02-01T09:00:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@zuvy.org',
    role: 'Ops',
    dateAdded: '2024-02-05T11:30:00Z',
    status: 'active'
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@zuvy.org',
    role: 'Instructor',
    dateAdded: '2024-02-10T16:45:00Z',
    status: 'active'
  },
  {
    id: '5',
    name: 'Lisa Park',
    email: 'lisa.park@zuvy.org',
    role: 'Instructor',
    dateAdded: '2024-02-15T13:20:00Z',
    status: 'active'
  },
  {
    id: '6',
    name: 'David Wilson',
    email: 'david.wilson@zuvy.org',
    role: 'Instructor',
    dateAdded: '2024-02-20T10:00:00Z',
    status: 'active'
  },
  {
    id: '7',
    name: 'Anna Thompson',
    email: 'anna.thompson@zuvy.org',
    role: 'Ops',
    dateAdded: '2024-02-25T15:30:00Z',
    status: 'active'
  }
];

// Mock Invite Links
export const mockInviteLinks: InviteLink[] = [
  {
    id: '1',
    role: 'Ops',
    token: 'ops-invite-abc123',
    expiresAt: '2024-03-15T23:59:59Z',
    createdBy: '1',
    createdAt: '2024-02-15T10:00:00Z',
    used: false
  },
  {
    id: '2',
    role: 'Instructor',
    token: 'instructor-invite-def456',
    expiresAt: '2024-03-20T23:59:59Z',
    createdBy: '1',
    createdAt: '2024-02-20T14:30:00Z',
    used: true,
    usedBy: '7',
    usedAt: '2024-02-20T16:45:00Z'
  }
];

// Helper functions for managing mock data
export const getMockUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getMockRolePermissions = (roleId: string): RoleActionPermission[] => {
  return mockRoleActionPermissions.filter(permission => permission.roleId === roleId);
};

export const getMockActionById = (actionId: string): Action | undefined => {
  return mockActions.find(action => action.id === actionId);
};

export const getMockRoleById = (roleId: string): Role | undefined => {
  return mockRoles.find(role => role.id === roleId);
};

export const canRolePerformAction = (roleId: string, actionId: string): boolean => {
  const permission = mockRoleActionPermissions.find(
    p => p.roleId === roleId && p.actionId === actionId
  );
  return permission?.allowed || false;
};