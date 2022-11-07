import * as loaders from '../loaders';
import {
  CreateTaskInput,
  LoginInput,
  LoginPayload,
  Task,
  UpdateTaskInput,
  User,
} from '../schema/types';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';


const sha1 = (data: string) => {
  return crypto
    .createHash('sha1')
    .update(data, 'binary')
    .digest('hex');
}

export default {
  Mutation: {
    createTask: async (
      __parent: unknown,
      args: { input: CreateTaskInput },
      { user }: { user: User },
    ): Promise<Partial<Task>> => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      const { name, description } = args.input;
      return await loaders.createTask(name, description, user.id, user.tenantId);
    },

    updateTask: async (
      __parent: unknown,
      args: { id: number, input: UpdateTaskInput },
      { user }: { user: User },
    ): Promise<Partial<Task>> => {
      if (!user) {
        throw new Error('Unauthorized');
      }
      const { name, description, statusId } = args.input;
      const task = await loaders.getTaskById(args.id);
      if (!task) {
        throw new Error('Task not found');
      }
      if (task.tenantId !== user.tenantId) {
        throw new Error('Unauthorized');
      }
      return await loaders.updateTask(args.id, name, description, statusId);
    },

    login: async (
      __parent: unknown,
      args: { input: LoginInput },
    ): Promise<LoginPayload> => {
      const { email, password } = args.input;
      const user = await loaders.getUserByEmail(email)
      if (!user) {
        throw new Error('Invalid credentials');
      }
      if (user && user.password === sha1(password)) {
        const token = jwt.sign(
          { user },
          process.env.JWT_SECRET,
          { expiresIn: '1d'}
        )
        return {
          token,
          user,
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }
  }
}
