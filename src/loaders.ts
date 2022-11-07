import prisma from './prisma';
import jwt from 'jsonwebtoken';
import { User } from './schema/types';

export const getTenant = async (id: number) => {
  return await prisma.tenant.findUnique({
    where: {
      id,
    }
  });
}

export const getUserFromToken = async (token: string): Promise<User> => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    const user = await getUserById((decoded as any).user.id);
    if (user) {
      return user;
    } else {
      throw new Error('Invalid token');
    }
  }
  throw new Error('Invalid token');
}

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export const getTasks = async (tenantId: number) => {
  return await prisma.task.findMany({
    where: {
      tenantId,
    },
    include: {
      user: true,
      status: true,
    }
  });
}

export const getTaskById = async (id: number) => {
  return await prisma.task.findUnique({
    where: {
      id,
    }
  });
}

export const getTaskStatuses = async () => {
  return await prisma.taskStatus.findMany({});
}

export const getInitialStatus = async () => {
  return await prisma.taskStatus.findFirst({
    where: {
      isInitial: true,
    }
  });
}

export const getTaskStatusById = async (statusId: number) => {
  return await prisma.taskStatus.findUnique({
    where: {
      id: statusId,
    }
  });
}

export const getTaskStatusesFrom = async (fromStatusId: number) => {
  return await prisma.taskStatusWorkflow.findMany({
    where: {
      from: fromStatusId,
    },
    include: {
      toStatus: true,
    }
  });
}

export const validateTaskStatusFromTo = async (fromStatusId: number, toStatusId: number) => {
  const status = await prisma.taskStatusWorkflow.findFirst({
    where: {
      from: fromStatusId,
      to: toStatusId,
    }
  });
  return status !== null;
}

export const createTask = async (name: string, description: string, userId: number, tenantId: number) => {
  const initialStatus = await getInitialStatus();
  if (!initialStatus) {
    throw new Error('DB not initialised');
  }
  return await prisma.task.create({
    data: {
      name,
      description,
      userId,
      tenantId,
      statusId: initialStatus.id,
    }
  });
}

export const updateTask = async (
  taskId: number,
  name?: string | null,
  description?: string | null,
  statusId?: number | null
) => {
  const task = await getTaskById(taskId);
  const data: any = {};

  if (name) {
    data.name = name;
  }
  if (description) {
    data.description = description;
  }
  if (statusId && await validateTaskStatusFromTo(task.statusId, statusId)) {
    data.statusId = statusId;
  }

  return await prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
}
