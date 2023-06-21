const { getUser } = require('../controllers/UsersController');

// module.exports = {
//   Auth: (req, res, next) => {
//     const user = getUser(req, res);
//     if (user) {
//       // User is authenticated, proceed to the next middleware or route handler
//       next();
//     } else {
//       // User is not authenticated, return an error response
//       res.status(401).json({ error: 'Unauthorized' });
//     }
//   },
// };
class Middleware {
  static async auth(req, res, next) {
    // Check if the user is authenticated
    const user = await getUser(req, res);
    if (user) {
      const userid = user._id;
      // User is authenticated, proceed to the next middleware or route handler
      // next(userid);
      req.userId = userid;
      next();
    } else {
      // User is not authenticated, return an error response
      res.status(401).json({ error: 'Unauthorized' });
      // return;
    }
  }
}

module.exports = Middleware;
