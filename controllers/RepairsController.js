/* eslint-disable radix */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import Bike from '../models/bikes';
import Repair from '../models/repairs';
import paginate from '../utils/paginate';

const mongoose = require('mongoose');

const moment = require('moment');

const { ObjectId } = mongoose.Types;
const { getUser } = require('./UsersController');
const { transactionLogger } = require('../utils/logger');

class RepairsController {
  static async getRepairs(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const items = await Repair.find();
      // res.json({ items: repairs }); // paginate -> totest
      const currentPage = parseInt(req.query.page) || 1;

      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

      const paginatedItems = paginate(items, currentPage, itemsPerPage);

      res.status(200).json({ repairs: paginatedItems });
      // http://localhost:5000/api/v1/repairs/index?page=2&itemsPerPage=20
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async scheduledRepairs(req, res) {
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
      const newDate = moment(nextRepair, 'YYYY-MM-DD');
      if (!newDate.isValid()) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }
      bike.repairs.scheduledrepair = newDate.format('YYYY-MM-DD'); // ToTest
      bike.repairs.previousrepair = bike.repairs.scheduledrepair;
      await bike.save();
      res.json({ message: 'Record updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async upcomingRepairs(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const today = moment().format('YYYY-MM-DD'); // Get today's date in 'YYYY-MM-DD' format

      const bikes = await Bike.find({
        'repairs.scheduledrepair': { $gt: today },
      });
      if (!bikes) {
        res.status(404).json({ error: 'Records not found' });
      }
      res.status(200).json({ shecduled: bikes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async todaysRepairs(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      // Get today's date in 'YYYY-MM-DD' format
      const today = moment().format('YYYY-MM-DD');
      const bikes = await Bike.find({
        'repairs.scheduledrepair': { $eq: today },
      });
      if (!bikes) {
        res.status(404).json({ error: 'Records not found' });
      }
      res.status(200).json({ shecduled: bikes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async recordRepairs(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const { bikeid, date, description } = req.body;
    try {
      const repairRecord = new Repair({
        bikeid: bikeid,
        date: date,
        description: description,
      });
      repairRecord.save((err, result) => {
        res.status(201).json({ id: result.id });
        transactionLogger.info(`New Repair Record: ${result.id}`);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = RepairsController;
