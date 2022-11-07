import * as loaders from '../loaders.js';
import { User, Task, TaskStatus } from '../schema/types.js';

export default {
  Query: {
    getTasks: async (): Promise<Array<Partial<Task>>> => {
      return await loaders.getTasks(1);
    },
    getStatuses: async (): Promise<Array<Partial<TaskStatus>>> => {
      return await loaders.getTaskStatuses();
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
    ): Promise<Array<Partial<TaskStatus>>> => {
      const workflowStatuses = await loaders.getTaskStatusesFrom(status.id);
      return workflowStatuses.map((status) => status.toStatus);
    }
  }
}
