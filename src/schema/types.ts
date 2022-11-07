export type Tenant = {
  id: number;
  name: string;
}

export type User = {
  id: number;
  email: string;
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
  status: Partial<TaskStatus>;
  user: User;
}

export type CreateTaskInput = {
  name: string;
  description: string;
  userId: number;
}

export type UpdateTaskInput = {
  name: string;
  description: string;
  statusId: number;
}

