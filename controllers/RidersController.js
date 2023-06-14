import User from '../models/user';

const { getUser } = require('./UsersController');

class RidersController {
  // eslint-disable-next-line no-unused-vars
  static async index(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const riders = await User.find()
      .populate({
        match: { designation: { $eq: 'rider' } },
      })
      .exec();
    res.status(200).json({ items: riders }); // only non private data ToDo + paginate
  }
}

module.exports = RidersController;
