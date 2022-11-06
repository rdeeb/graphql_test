import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import schema from './schema.js';
import resolvers from './resolvers.js';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

console.log(`🚀  Server ready at: ${url}`);
