const User = require('./../models/User');

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  try {
    // Look for a user by token
    const user = await User.findOne({ token: token });
    // console.log(user);

    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach  user to object
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = isAuthenticated;
