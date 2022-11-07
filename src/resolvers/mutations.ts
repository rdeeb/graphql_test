import * as loaders from '../loaders.js';
import { CreateTaskInput, Task, UpdateTaskInput } from '../schema/types';

export default {
  Mutation: {
    createTask: async (
      __parent: unknown,
      args: { input: CreateTaskInput },
    ): Promise<Partial<Task>> => {
      const { name, description, userId } = args.input;
      return await loaders.createTask(name, description, userId);
    },
    updateTask: async (
      __parent: unknown,
      args: { id: number, input: UpdateTaskInput },
    ): Promise<Partial<Task>> => {
      const { name, description, statusId } = args.input;
      return await loaders.updateTask(args.id, name, description, statusId);
    }
  }
}
