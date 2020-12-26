require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const DefaultAPI = require('./datasources/default');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const AuthAPI = require('./datasources/auth');

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, cb){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN,
  algorithms: ['RS256']
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    if(!token) return { user: null };
    const user = new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err, decoded) => {
        if(err) {
          return reject(err);
        }
        resolve(decoded.email);
      });
    });

    return {
      user
    };
  },
  dataSources: () => ({
    defaultAPI: new DefaultAPI({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }),
    authAPI: new AuthAPI(process.env.AUTH0_DOMAIN)
  })
});

server.listen().then(() => {
  console.log(`
      Server is running!
      Listening on port 4000
    `);
});