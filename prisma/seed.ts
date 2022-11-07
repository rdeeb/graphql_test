import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const taskStatuses = [
    {
      id: 1,
      name: 'To Do',
      isInitial: true,
    },
    {
      id: 2,
      name: 'In Progress',
    },
    {
      id: 3,
      name: 'Done',
    },
    {
      id: 4,
      name: 'Archived',
    }
  ];
  const workflows = [
    {
      from: 1,
      to: 2,
    },
    {
      from: 1,
      to: 4,
    },
    {
      from: 2,
      to: 3,
    },
    {
      from: 3,
      to: 4,
    },
    {
      from: 2,
      to: 1,
    },
  ];
  const tenants = [
    {
      id: 1,
      name: 'Tenant 1',
      slug: 'tenant1'
    },
    {
      id: 2,
      name: 'Tenant 2',
      slug: 'tenant2'
    },
  ];
  const users = [
    {
      username: 'someuser',
      email: 'john@server1.com',
      password: '6fead90aa061349b9874d904c108b59c79d12d76',
      tenantId: 1,
    },
    {
      username: 'randomuser',
      email: 'doe@server1.com',
      password: '6fead90aa061349b9874d904c108b59c79d12d76',
      tenantId: 1,
    },
    {
      username: 'auser',
      email: 'john@server2.com',
      password: '6fead90aa061349b9874d904c108b59c79d12d76',
      tenantId: 2,
    },
  ]

  console.log('Seeding database...');

  await prisma.taskStatus.createMany({
    data: taskStatuses,
  });
  console.log('Seeded task statuses');

  await prisma.taskStatusWorkflow.createMany({
    data: workflows,
  });
  console.log('Seeded task status workflows');

  await prisma.tenant.createMany({
    data: tenants,
  });
  console.log('Seeded tenants');

  await prisma.user.createMany({
    data: users,
  });
  console.log('Seeded users');
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
