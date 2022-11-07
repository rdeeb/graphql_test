import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTenants = async () => {
  return await prisma.tenant.findMany();
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

export const getTasks = async (userId: number) => {
  return await prisma.task.findMany({
    where: {
      userId,
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

export const createTask = async (name: string, description: string, userId: number) => {
  const initialStatus = await getInitialStatus();
  return await prisma.task.create({
    data: {
      name,
      description,
      userId,
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
