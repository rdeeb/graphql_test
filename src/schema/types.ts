export type Tenant = {
  id: number;
  name: string;
}

export type User = {
  id: number;
  username: string;
  email: string;
  tenantId: number;
}

export type TaskStatus = {
  id: number;
  name: string;
  isInitial: boolean;
  toStatuses: Array<TaskStatus>;
}

export type Task = {
  id: number;
  name: string;
  description: string;
  userId: number;
  statusId: number;
  tenantId: number;
  status: Partial<TaskStatus>;
  user: User;
  tenant: Tenant;
}

export type CreateTaskInput = {
  name: string;
  description: string;
}

export type UpdateTaskInput = {
  name?: string;
  description?: string;
  statusId?: number;
}

export type LoginInput = {
  email: string;
  password: string;
}

export type LoginPayload = {
  token: string;
  user: User;
}
