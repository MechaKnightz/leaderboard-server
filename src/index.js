const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const DefaultAPI = require('./datasources/default');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    defaultAPI: new DefaultAPI()
  })
});

server.listen().then(() => {
  console.log(`
      Server is running!
      Listening on port 4000
    `);
});