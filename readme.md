## GraphQL Test

A simple task manager backend built with GraphQL and Node.js.

## Setting up the project

### Installation

```bash
git clone git@github.com:rdeeb/graphql_test.git
npm install
```

### Setup

First we need to have a postgres database running. You can use docker to run a postgres container:
```bash
npm run db:dev
```

We need to add a `.env` file to the root of the project. You can use the `.env.example` file as a template. After this we need to create the database and the tables:
```bash
npx prisma migrate dev
```

After that we can seed the database with some data:
```bash
npx prisma db seed
```

### Run

To run the server, run the following command:

```bash
npm run start
```

## Test

To run the tests, run the following command:

```bash
npm run test
```

## GraphQL Playground

To access the GraphQL Playground, go to http://localhost:4000. You can use the following query to get all the tasks:

```graphql
query {
  tasks {
    id
    name
    description
    status
  }
}
```

A task can have a status, and can move into a different status, to know about the available statuses 
and it's possible transitions, you can use the following query:

```graphql 
query {
  taskStatuses {
    id
    name
    toStatuses {
      id
      name
    }
  }
}
```

In order to retrieve the tasks or create or update a task, you need to be authenticated. To do that,
you can use the following mutation:

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      email
      id
    }
  }
}
```

With the token now you can access the create and update task mutations:

```graphql
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    name
    description
  }
}
```

```graphql
mutation UpdateTask($updateTaskId: Int!, $input: UpdateTaskInput!) {
  updateTask(id: $updateTaskId, input: $input) {
    id
    name
    description
    status {
      id
      name
      isInitial
    }
    user {
      id
      email
    }
  }
}
```
