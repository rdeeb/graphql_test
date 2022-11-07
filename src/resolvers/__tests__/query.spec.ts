import * as loaders from '../../loaders';
import QueryResolver from '../query';

// Mock the loaders get tasks function
jest.mock('../../loaders', () => ({
  getTasks: jest.fn(),
  getTaskStatuses: jest.fn(),
}));

describe('query', () => {
  describe('getTasks', () => {
    beforeEach(() => {
      // Mock the getTasks function
      // @ts-ignore
      loaders.getTasks.mockImplementation((tenantId) => {
        // Return a mock task if the tenantId is 1
        if (tenantId === 1) {
          return [{
            id: 1,
            name: 'Test Task',
            description: 'Test Description',
            statusId: 1,
            userId: 1,
            tenantId: 1,
          }];
        }
        return null;
      });
    });

    afterEach(() => {
      // Reset the mock
      // @ts-ignore
      loaders.getTasks.mockReset();
    });

    it('should return a list of tasks', async () => {
      // Create a mock context
      const context = {
        user: {
          id: 1,
          email: 'some@user.com',
          username: 'someuser',
          tenantId: 1,
        },
      };

      // Call the getTasks function
      const tasks = await QueryResolver.Query.getTasks(null, null, context);
      expect(tasks).not.toBeNull();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toEqual(1);
    });

    it('should throw an error if the user is not logged in', async () => {
      // Create a mock context
      const context = {
        // @ts-ignore
        user: null,
      };

      // Call the getTasks function
      await expect(QueryResolver.Query.getTasks(null, null, context)).rejects.toThrow('Unauthorized');
    });

    it('should not return tasks if the user is in the wrong tenant', async () => {
      // Create a mock context
      const context = {
        user: {
          id: 1,
          email: 'some@user.com',
          username: 'someuser',
          tenantId: 2,
        },
      };

      // Call the getTasks function
      const tasks = await QueryResolver.Query.getTasks(null, null, context);
      expect(tasks).toBeNull();
    });
  });

  describe('getStatuses', () => {
    beforeEach(() => {
      // Mock the getTasks function
      // @ts-ignore
      loaders.getTaskStatuses.mockImplementation(() => {
        // Return a mock task if the tenantId is 1
        return [{
          id: 1,
          name: 'Test Status',
          description: 'Test Description',
          fromStatusId: 1,
          toStatusId: 2,
        }];
      });
    });

    afterEach(() => {
      // Reset the mock
      // @ts-ignore
      loaders.getTaskStatuses.mockReset();
    });

    it('should return a list of statuses', async () => {
      // Call the getTasks function
      const statuses = await QueryResolver.Query.getStatuses();
      expect(statuses).not.toBeNull();
      expect(statuses).toHaveLength(1);
      expect(statuses[0].id).toEqual(1);
    });
  });
});
