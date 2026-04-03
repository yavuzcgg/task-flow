import apiClient from "./client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskFilterParams,
  CommentResponse,
  CreateCommentRequest,
  PagedResult,
  PaginationParams,
  ProjectMemberResponse,
  InviteToProjectRequest,
  InvitationResponse,
  UpdateMemberRoleRequest,
} from "@/types";

// ===== Auth =====
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data),
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", data),
};

// ===== Projects =====
export const projectsApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get<PagedResult<ProjectResponse>>("/projects", { params }),
  getById: (id: string) =>
    apiClient.get<ProjectResponse>(`/projects/${id}`),
  create: (data: CreateProjectRequest) =>
    apiClient.post<ProjectResponse>("/projects", data),
  update: (id: string, data: UpdateProjectRequest) =>
    apiClient.put<ProjectResponse>(`/projects/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/projects/${id}`),
};

// ===== Tasks =====
export const tasksApi = {
  getByProject: (projectId: string, params?: TaskFilterParams) =>
    apiClient.get<PagedResult<TaskResponse>>(`/projects/${projectId}/tasks`, {
      params,
    }),
  getById: (id: string) =>
    apiClient.get<TaskResponse>(`/tasks/${id}`),
  create: (projectId: string, data: CreateTaskRequest) =>
    apiClient.post<TaskResponse>(`/projects/${projectId}/tasks`, data),
  update: (id: string, data: UpdateTaskRequest) =>
    apiClient.put<TaskResponse>(`/tasks/${id}`, data),
  updateStatus: (id: string, data: UpdateTaskStatusRequest) =>
    apiClient.patch<TaskResponse>(`/tasks/${id}/status`, data),
  delete: (id: string) =>
    apiClient.delete(`/tasks/${id}`),
};

// ===== Project Members =====
export const membersApi = {
  getByProject: (projectId: string) =>
    apiClient.get<ProjectMemberResponse[]>(
      `/projects/${projectId}/members`
    ),
  invite: (projectId: string, data: InviteToProjectRequest) =>
    apiClient.post<InvitationResponse>(
      `/projects/${projectId}/invitations`,
      data
    ),
  remove: (projectId: string, userId: string) =>
    apiClient.delete(`/projects/${projectId}/members/${userId}`),
  updateRole: (projectId: string, userId: string, data: UpdateMemberRoleRequest) =>
    apiClient.put(`/projects/${projectId}/members/${userId}/role`, data),
};

// ===== Invitations =====
export const invitationsApi = {
  getPending: () =>
    apiClient.get<InvitationResponse[]>("/invitations/pending"),
  respond: (id: string, accept: boolean) =>
    apiClient.post<InvitationResponse>(`/invitations/${id}/respond`, {
      accept,
    }),
  cancel: (id: string) => apiClient.delete(`/invitations/${id}`),
};

// ===== Comments =====
export const commentsApi = {
  getByTask: (taskId: string, params?: PaginationParams) =>
    apiClient.get<PagedResult<CommentResponse>>(`/tasks/${taskId}/comments`, {
      params,
    }),
  create: (taskId: string, data: CreateCommentRequest) =>
    apiClient.post<CommentResponse>(`/tasks/${taskId}/comments`, data),
  delete: (id: string) =>
    apiClient.delete(`/comments/${id}`),
};
