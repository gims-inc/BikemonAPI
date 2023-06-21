/* eslint-disable object-shorthand */
/* eslint-disable radix */
import User from '../models/user';
import paginate from '../utils/paginate';
import Bike from '../models/bikes';

const mongoose = require('mongoose');
const { getUser } = require('./UsersController');
const { transactionLogger } = require('../utils/logger');

const { ObjectId } = mongoose.Types;

class RidersController {
  // eslint-disable-next-line no-unused-vars
  static async index(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const riders = await User.find({ designation: 'rider' });
      // .populate({
      //   match: { designation: 'rider' },
      // })
      //   .exec();
      const currentPage = parseInt(req.query.page) || 1;

      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

      const paginatedItems = paginate(riders, currentPage, itemsPerPage);

      res.status(200).json({ riders: paginatedItems }); // only non private data ToDo + paginate
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async findbyId(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const riderId = req.params.id;
    try {
      const rider = await User.findOne({ _id: ObjectId(riderId) });

      if (!rider) {
        res.status(404).json({ error: 'Rider not found' });
        return;
      }

      res.status(200).json({ rider: rider });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async assignBike(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const bikeId = req.query.val_one;
    const userid = req.query.val_two;

    if (!bikeId || !userid) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    try {
      const bike = await Bike.findById(bikeId);

      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      // Check if the bike is already assigned to another user
      if (bike.userid !== null) {
        res.status(400).json({ error: 'Bike is already assigned to another user' });
        return;
      }

      // Check if the user is already assigned to any other bikes
      const assignedBikes = await Bike.find({ userid: userid });
      if (assignedBikes.length > 0) {
        res.status(400).json({ error: 'User is already assigned to another bike' });
        return;
      }

      bike.userid = userid;
      await bike.save();

      res.status(200).json({ message: `Bike ${bike.plate} assigned successfully to: ${userid}` });
      transactionLogger.info(`Bike ${bike.plate} asinged to riderId: ${userid}`, { meta: userid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = RidersController;

// { isPrivate: false },
// { password: 0 },
