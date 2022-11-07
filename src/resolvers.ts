import Query from './resolvers/query.js';
import Mutation from './resolvers/mutations.js';

export default {
  ...Query,
  ...Mutation,
};
