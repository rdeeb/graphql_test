import * as loaders from '../../loaders';
import MutationsResolver from '../mutations';

// Mock the loaders get tasks function
jest.mock('../../loaders', () => ({
  createTask: jest.fn(),
  updateTask: jest.fn(),
  getTaskById: jest.fn(),
  getUserByEmail: jest.fn(),
}));

// Create a mock context
const context = {
  user: {
    id: 1,
    email: 'some@user.com',
    username: 'someuser',
    tenantId: 1,
  },
};

// Tests for the createTask, updateTask and login mutations
describe('mutations', () => {
  describe('createTask', () => {
    beforeEach(() => {
      // Mock the getTasks function
      // @ts-ignore
      loaders.createTask.mockReturnValue({
        id: 1,
        name: 'Test Task',
        description: 'Test Description',
        statusId: 1,
        userId: 1,
        tenantId: 1,
      });
    });

    afterEach(() => {
      // Reset the mock
      // @ts-ignore
      loaders.createTask.mockReset();
    });

    it('should create a task', async () => {
      // Call the createTask function
      const task = await MutationsResolver.Mutation.createTask(null, { input: { name: 'Test Task', description: 'Test Description' } }, context);
      expect(task).not.toBeNull();
      expect(task.id).toEqual(1);
    });

    it('should throw an error if the user is not logged in', async () => {
      // Create a mock context
      const context = {
        // @ts-ignore
        user: null,
      };

      // Call the createTask function
      await expect(MutationsResolver.Mutation.createTask(null, { input: { name: 'Test Task', description: 'Test Description' } }, context)).rejects.toThrowError('Unauthorized');
    });
  });

  describe('updateTask', () => {
    beforeEach(() => {
      // Mock the getTasks function
      // @ts-ignore
      loaders.updateTask.mockReturnValue({
        id: 1,
        name: 'Test Task',
        description: 'Updated Description',
        statusId: 1,
        userId: 1,
        tenantId: 1,
      });
      // @ts-ignore
      loaders.getTaskById.mockImplementation((id:number) => {
        if (id === 1) {
          return {
            id: 1,
            name: 'Test Task',
            description: 'Test Description',
            statusId: 1,
            userId: 1,
            tenantId: 1,
          };
        }
        return null;
      });
    });

    afterEach(() => {
      // Reset the mock
      // @ts-ignore
      loaders.updateTask.mockReset();
      // @ts-ignore
      loaders.getTaskById.mockReset();
    });

    it('should update a task', async () => {
      // Call the updateTask function
      const task = await MutationsResolver.Mutation.updateTask(null, { id: 1, input: { name: 'Test Task', description: 'Updated Description' } }, context);
      expect(task).not.toBeNull();
      expect(task.id).toEqual(1);
    });

    it('should throw an error if the task does not exist', async () => {
      // Call the updateTask function
      await expect(MutationsResolver.Mutation.updateTask(
        null,
        { id: 2, input: { name: 'Test Task', description: 'Updated Description' } },
        context
      )).rejects.toThrowError('Task not found');
    });

    it('should throw an error if the user is not logged in', async () => {
      // Create a mock context
      const context = {
        // @ts-ignore
        user: null,
      };

      // Call the updateTask function
      await expect(MutationsResolver.Mutation.updateTask(
        null,
        { id: 1, input: { name: 'Test Task', description: 'Test Description' } },
        context
      )).rejects.toThrowError('Unauthorized');
    });
  });

  describe('login', () => {
    const previousJWT_SECRET = process.env.JWT_SECRET;
    beforeEach(() => {
      process.env.JWT_SECRET = 'test';
      // Mock the getTasks function
      // @ts-ignore
      loaders.getUserByEmail.mockImplementation((email:string) => {
        if (email === 'some@user.com') {
          return {
            id: 1,
            email: 'some@user.com',
            username: 'someuser',
            password: 'f8377c90fcfd699f0ddbdcb30c2c9183d2d933ea',
            tenantId: 1,
          };
        } else {
          return null;
        }
      });
    });

    afterEach(() => {
      process.env.JWT_SECRET = previousJWT_SECRET;
      // Reset the mock
      // @ts-ignore
      loaders.getUserByEmail.mockReset();
    });

    it('should login a user', async () => {
      // Call the login function
      const response = await MutationsResolver.Mutation.login(null, {
        input: {
          email: 'some@user.com',
          password: 'somepassword'
        }
      });
      expect(response).not.toBeNull();
      expect(response.token).not.toBeNull();
      expect(response.user.id).toBe(1);
    });

    it('should throw an error if the user does not exist', async () => {
      // Call the login function
      await expect(MutationsResolver.Mutation.login(null, {
        input: {
          email: 'wrong@user.com',
          password: 'wrongpassword'
        }
      })).rejects.toThrowError('Invalid credentials');
    });

    it('should throw an error if the password is incorrect', async () => {
      // Call the login function
      await expect(MutationsResolver.Mutation.login(null, {
        input: {
          email: 'some@user.com',
          password: 'wrongpassword'
        }
      })).rejects.toThrowError('Invalid credentials');
    });
  });
});
