export default {
  PORT: process.env.PORT || 8000,
  DB_URL: 'mongodb://localhost/tweet-development',
  // DB_URL: 'mongodb://lydia:Panmongodb!@localhost:27017/my_db_name',
  GRAPHQL_PATH: '/graphql',
  JWT_SECRET: 'thisisasecret123',
};
