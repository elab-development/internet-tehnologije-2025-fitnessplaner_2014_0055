'use strict';

const bcrypt = require('bcryptjs');

const users = [
  ['user', 'user@test.com', 'user1234', 'user'],
  ['admin', 'admin@test.com', 'admin1234', 'admin'],
  ['trainer', 'trainer@test.com', 'trainer1234', 'trainer'],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      'Users',
      await Promise.all(
        users.map(async ([username, email, password, role]) => ({
          username,
          email,
          password: await bcrypt.hash(password, 10),
          role,
          createdAt: now,
          updatedAt: now,
        })),
      ),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: { [Sequelize.Op.in]: users.map(([, email]) => email) },
    });
  },
};
