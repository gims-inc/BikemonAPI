/* eslint-disable radix */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import Bike from '../models/bikes';
import Repair from '../models/repairs';
import paginate from '../utils/paginate';

const mongoose = require('mongoose').set('debug', true);

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
      const bikeId = req.query.id;
      // console.log(`param ->bike: ${bikeId}`); // debug null y!?
      const nextRepair = req.query.set_repair_date;
      // const bike = Bike.findById({ _id: bikeId });
      // console.log(`findById ->bike: ${bike}`); // debug
      // if (!bike) {
      //   // errors.bike = '';
      //   res.status(404).json({ error: 'Record not found' });
      //   return;
      // }
      const newDate = moment(nextRepair, 'YYYY-MM-DD');
      console.log(`new date: ${newDate}`); // debug
      if (!newDate.isValid() || newDate.isBefore()) {
        res.status(400).json({ error: 'Invalid date format or date is less than today!' });
        return;
      }

      // const newPreviousDate = bike.scheduledrepair.format('YYYY-MM-DD') || '';
      // console.log(`old repair date: ${bike.scheduledrepair}`); // debug
      // if (newDate === newPreviousDate) {
      //   res.status(400).json({ error: 'Schedule already made!' });
      //   return;
      // }
      // bike.scheduledrepair = newDate.format('YYYY-MM-DD'); // buggy
      // bike.previousrepair = bike.scheduledrepair || null;

      // bike.repairs = {
      //   scheduledrepair: newDate.format('YYYY-MM-DD'),
      //   previousrepair: bike.repairs.scheduledrepair || '',
      // };

      // bike.repairs = bike.repairs || {}; // Initialize repairs object if it's undefined
      // bike.repairs.scheduledrepair = newDate.format('YYYY-MM-DD');
      // bike.repairs.previousrepair = bike.repairs.scheduledrepair || '';

      // const updatedBike = await Bike.findOneAndUpdate(
      //   { _id: ObjectId(bikeId) },
      //   {
      //     $set: {
      //       'repairs.scheduledrepair': newDate.format('YYYY-MM-DD'),
      //       'repairs.previousrepair': 'repairs.scheduledrepair' || newDate.format('YYYY-MM-DD'),
      //     },
      //   },
      //   { new: true },
      // );

      // if (!updatedBike) {
      //   res.status(404).json({ error: 'Record not found' });
      //   return;
      // }

      Bike.findByIdAndUpdate(bikeId,
        {
          $set:
          {
            scheduledrepair: newDate.format('YYYY-MM-DD'),
            // previousrepair: '' || newDate.format('YYYY-MM-DD'),
          },
        },
        (err, doc) => {
          // console.log(doc);
          if (err) {
            res.status(404).json({ error: 'Record not found' });
          } else {
            res.status(200).json({ message: `Bike scheduled for repair on: ${doc.scheduledrepair}` });
            // reconstruct logger string+meta Todo
            transactionLogger.info(`Upcoming repair updated: ${doc._id}, date: ${doc.scheduledrepair}`, { meta: bikeId });
          }
        });

      // await bike.save();
      // res.json({ message: 'Record updated successfully' });
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
      const today = moment().format('YYYY-MM-DD');

      const bikes = await Bike.find({
        scheduledrepair: { $gt: today },
      });
      if (!bikes) {
        res.status(404).json({ error: 'Records not found' });
      }
      res.status(200).json({ shecduled: bikes }); // paginate
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
        scheduledrepair: { $eq: today },
      });
      if (!bikes) {
        res.status(404).json({ error: 'Records not found' });
      }
      res.status(200).json({ shecduled: bikes }); // paginate
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
        transactionLogger.info(`New Repair Record: ${result.id}`); // meta
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = RepairsController;
