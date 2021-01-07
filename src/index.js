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

function getKey(header, cb) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;
    //if(req.headers.origin == "http://localhost:3000")
    //  console.log(req.headers);
    if (!token) return { user: null };
    let user = new Promise((resolve, reject) => {
      try {
        jwt.verify(token, getKey, options, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      } catch (e) {
        reject(e);
      }
    });

    user.catch((e) => {
      user = null;
    })

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
    authAPI: new AuthAPI(process.env.AUTH0_DOMAIN, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_BACKEND_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
      grant_type: "client_credentials"
    })
  })
});

server.listen().then(() => {
  console.log(`
      Server is running!
      Listening on port 4000
    `);
});