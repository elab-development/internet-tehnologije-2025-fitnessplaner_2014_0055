const { User } = require('../models');

const ROLES = ['user', 'trainer', 'admin'];

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

async function updateUserRole(req, res) {
  const id = Number(req.params.id);
  const { role } = req.body;

  if (!isPositiveInteger(id)) {
    return res.status(400).json({ message: 'invalid id' });
  }

  if (!ROLES.includes(role)) {
    return res.status(400).json({ message: `role must be one of ${ROLES.join(', ')}` });
  }

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }

  await user.update({ role });

  return res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
}

module.exports = { updateUserRole };
