import User from '../models/user';

module.exports = {
  Auth: (req, res, next) => {
    const user = User.getUser(req, res);
    if (user) {
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, return an error response
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
};
