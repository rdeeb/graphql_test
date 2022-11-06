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
  });
}

export const getTaskStatusById = async (statusId: number) => {
  return await prisma.taskStatus.findUnique({
    where: {
      id: statusId,
    }
  });
}

export const getTaskStatusesFromTo = async (fromStatusId: number) => {
  return await prisma.taskStatusWorkflow.findMany({
    where: {
      from: fromStatusId,
    }
  }).;
}
