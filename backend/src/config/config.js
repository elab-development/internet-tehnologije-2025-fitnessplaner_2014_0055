const { db } = require('./env');

module.exports = {
  development: {
    username: db.user,
    password: db.password,
    database: db.name,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
  },
};
