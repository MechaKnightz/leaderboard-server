require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const DefaultAPI = require('./datasources/default');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    defaultAPI: new DefaultAPI({
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS
    })
  })
});

server.listen().then(() => {
  console.log(`
      Server is running!
      Listening on port 4000
    `);
});