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
