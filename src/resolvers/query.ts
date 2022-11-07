import * as loaders from '../loaders';
import {
  User,
  Task,
  TaskStatus,
  Tenant
} from '../schema/types';

export default {
  Query: {
    getTasks: async (
      __parent: unknown,
      __args: unknown,
      { user }: { user: User },
    ): Promise<Array<Partial<Task>>> => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      return await loaders.getTasks(user.tenantId);
    },

    getStatuses: async (): Promise<Array<Partial<TaskStatus>>> => {
      return await loaders.getTaskStatuses();
    }
  },
  User: {
    tenant: async (user: User): Promise<Partial<Tenant>> => {
      return await loaders.getTenant(user.tenantId);
    }
  },
  Task: {
    user: async ( task: Task ): Promise<Partial<User>> => {
      return loaders.getUserById(task.userId);
    },
    status: async ( task: Task ): Promise<Partial<TaskStatus>> => {
      return loaders.getTaskStatusById(task.statusId);
    },
    tenant: async ( task: Task ): Promise<Partial<Tenant>> => {
      return loaders.getTenant(task.tenantId);
    },
  },
  TaskStatus: {
    toStatuses: async ( status: TaskStatus  ): Promise<Array<Partial<TaskStatus>>> => {
      const workflowStatuses = await loaders.getTaskStatusesFrom(status.id);
      return workflowStatuses.map((status) => status.toStatus);
    }
  }
}
