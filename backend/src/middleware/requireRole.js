module.exports = function requireRole(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
