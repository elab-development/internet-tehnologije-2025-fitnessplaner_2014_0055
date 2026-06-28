const { db } = require('./env');

const base = {
  username: db.user,
  password: db.password,
  database: db.name,
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  seederStorage: 'sequelize',
};

module.exports = {
  development: base,
  test: base,
  production: base,
};
