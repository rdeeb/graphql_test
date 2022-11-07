import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import schema from './schema';
import resolvers from './resolvers';
import { getUserFromToken } from './loaders';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      const user = await getUserFromToken(token);
      return { user };
    }
  },
})
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
