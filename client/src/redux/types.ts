export interface UserState {
  id: string;
  username: string;
  token: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  username: string;
}

export interface ProjectMember {
  id: number;
  joinedAt: Date;
  member: User;
}

export interface Note {
  id: number;
  taskId: string;
  body: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectState {
  id: string;
  name: string;
  members: ProjectMember[];
  tasks: Array<{ id: string }>;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskState {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  notes: Note[];
  isResolved: boolean;
  createdBy: User;
  updatedBy?: User;
  closedBy?: User;
  reopenedBy?: User;
  closedAt?: Date;
  reopenedAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
  assignedUsers: AssignedUser[];
}

export interface AssignedUser {
  id: string;
  joinedAt: Date;
  user: User;
}

export type ProjectSortValues =
  | 'newest'
  | 'oldest'
  | 'a-z'
  | 'z-a'
  | 'most-tasks'
  | 'least-tasks'
  | 'most-members'
  | 'least-members';

export type TaskSortValues =
  | 'newest'
  | 'oldest'
  | 'a-z'
  | 'z-a'
  | 'closed'
  | 'reopened'
  | 'h-l'
  | 'l-h'
  | 'updated'
  | 'most-notes'
  | 'least-notes';

export type TaskFilterValues = 'all' | 'closed' | 'open';

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}


export interface ProjectPayload {
  name: string;
  members: string[];
}

export interface TaskPayload {
  title: string;
  description: string;
  priority: TaskPriority;
  assignedUsers?: AssignedUser[]
}

export interface EditedTaskData extends TaskPayload {
  updatedAt: Date;
  updatedBy: User;
}

export interface ClosedReopenedTaskData {
  isResolved: boolean;
  closedAt: Date;
  closedBy: User;
  reopenedAt: Date;
  reopenedBy: User;
}

export interface NotifPayload {
  message: string;
  type: 'success' | 'error';
}
