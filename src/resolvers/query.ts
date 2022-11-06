import * as loaders from '../loaders.js';

type Tenant = {
  id: number;
  name: string;
}

type User = {
  id: number;
  email: string;
  tenant: Tenant;
}

type TaskStatus = {
  id: number;
  name: string;
  toStatuses: Array<TaskStatus>;
}

type Task = {
  id: number;
  name: string;
  description: string;
  userId: number;
  statusId: number;
  status: TaskStatus;
  user: User;
}

export default {
  Query: {
    getTasks: async (
      ___parent: unknown,
      ___args: unknown,
      context: any,
    ): Promise<Array<Partial<Task>>> => {
      return await loaders.getTasks(1);
    }
  },
  Task: {
    user: async (
      task: Task,
      ___args: unknown,
      context: any,
    ): Promise<Partial<User>> => {
      return loaders.getUserById(task.userId);
    },
    status: async (
      task: Task,
      ___args: unknown,
      context: any,
    ): Promise<Partial<TaskStatus>> => {
      return loaders.getTaskStatusById(task.statusId);
    }
  },
  TaskStatus: {
    toStatuses: async (
      status: TaskStatus,
      ___args: unknown,
      context: any,
    ): Promise<Array<Partial<TaskStatus>>> => {
      return loaders.getTaskStatusesFromTo(status.id);
    }
  }
}