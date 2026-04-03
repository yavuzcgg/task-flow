// ===== Enums =====

export enum TaskItemStatus {
  Todo = 0,
  InProgress = 1,
  InReview = 2,
  Done = 3,
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export enum UserRole {
  Developer = 0,
  ProjectManager = 1,
  Admin = 2,
}

export enum ProjectRole {
  Viewer = 0,
  Member = 1,
  Admin = 2,
  Owner = 3,
}

export enum InvitationStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Cancelled = 3,
}

// ===== Auth =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// ===== Project =====

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string | null;
  userRole: string | null;
  memberCount: number;
}

// ===== Project Members =====

export interface ProjectMemberResponse {
  id: string;
  projectId: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  role: string;
  joinedAt: string;
}

export interface InviteToProjectRequest {
  email: string;
  role?: ProjectRole;
}

export interface InvitationResponse {
  id: string;
  projectId: string;
  projectName: string;
  invitedByUserName: string;
  invitedEmail: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface RespondToInvitationRequest {
  accept: boolean;
}

export interface UpdateMemberRoleRequest {
  role: ProjectRole;
}

// ===== Task =====

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskStatusRequest {
  status: TaskItemStatus;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  projectId: string;
  assigneeId: string | null;
  createdById: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface TaskFilterParams {
  status?: TaskItemStatus;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  pageSize?: number;
}

// ===== Comment =====

export interface CreateCommentRequest {
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  taskItemId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string | null;
}

// ===== Common =====

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}
