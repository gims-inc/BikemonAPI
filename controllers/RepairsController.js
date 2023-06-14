/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import Bike from '../models/bikes';
import Repairs from '../models/repairs';

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const { getUser } = require('./UsersController');
const { transactionLogger } = require('../utils/logger');

class RepairsController {
  static async getRepair(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const repairs = await Repairs.find();
      res.json({ items: repairs }); // paginate
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async scheduledRepair(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const bikeId = req.params.id;
      const nextRepair = req.params.setrepair;
      const bike = await Bike.findById(bikeId);
      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
      }
      bike.repairs.scheduledrepair = 'new date'; // incomplete
      bike.repairs.previousrepair = bike.repairs.scheduledrepair;
      await bike.save();
      res.json({ message: 'Record updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = RepairsController;
