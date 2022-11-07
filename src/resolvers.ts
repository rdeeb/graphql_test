import Query from './resolvers/query';
import Mutation from './resolvers/mutations';

export default {
  ...Query,
  ...Mutation,
};
