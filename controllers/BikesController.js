/* eslint-disable radix */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import Bike from '../models/bikes';
import User from '../models/user';
import paginate from '../utils/paginate';
import transformInput from '../utils/cleanNumberPlate';
// import String from '../utils/strformat';

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const { getUser } = require('./UsersController');
const { transactionLogger } = require('../utils/logger');

//  const { authenticate } = require('./AuthController');

class BikeController {
  static async index(req, res) { // paginate -> ToTest
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const items = await Bike.find();
    const currentPage = parseInt(req.query.page) || 1;

    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

    const paginatedItems = paginate(items, currentPage, itemsPerPage);

    res.status(200).json({ bikes: paginatedItems });
    // http://localhost:5000/api/v1/bikes/index?page=2&itemsPerPage=20
  }

  static async search(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const data = req.query.plate_no;
    const clean = transformInput(data);
    console.log(`Search: ${clean}`);
    try {
      const bike = await Bike.find({
        plate: clean,
      }); // 'repairs.scheduledrepair': { $eq: clean },
      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
      }
      res.status(200).json({ bike: bike });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async newBike(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      plate, trackerid, riderid, repairs, description, image,
    } = req.body;

    await Bike.findOne({ plate: plate }, (err, doc) => {
      if (doc) {
        res.status(400).json({ error: 'Record already exist' });
      } else {
        try {
          const newBike = new Bike({
            plate: transformInput(plate),
            trackerid: trackerid || null,
            userid: riderid || null,
            description: description,
            repairs: repairs || null,
            image: image || null,
          });
          newBike.save((err, result) => {
            res.status(201).json({ id: result.id, no: result.plate });

            const additionalData = {
              user: user._id,
              requestId: result.id,
            };

            transactionLogger.info(`New Bike: ${plate}`, { meta: additionalData });
          });
        } catch (error) {
          console.log(error);
          transactionLogger.error('Bike record creation failed', { meta: error });
        }
      }
    });
  }

  static async updateBike(req, res) {
    const user = await getUser(req);
    // add better logic -only admins can edit-Todo
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const { id } = req.body;
      const { plate } = req.body;
      const { userid } = req.body;
      const { description } = req.body;
      const bike = await Bike.findOne({ _id: ObjectId(id), plate: plate });
      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
      }
      // bike.plate = req.body.plate;
      const rider = User.findById(userid);
      if (rider.designation === 'rider') { // debug
        res.status(404).json({ error: 'Record for rider not found' });
      }
      bike.userid = rider; // if user id not in rider collection decline ToDo
      bike.description = description;
      // bike.image = req.body.image;
      await bike.save();
      res.json({ message: 'Record updated successfully' });
      const additionalData = {
        user: user._id,
        bikeId: bike._id,
      };
      transactionLogger.info(`Bike record updated by: ${user.username}`, { meta: additionalData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      transactionLogger.error('Record update failed', { meta: error });
    }
  }

  static async softDelete(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const bikeId = req.params.id;
      const bike = await Bike.findById(bikeId);
      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
      }
      bike.isDelete = true;
      await bike.save();
      res.json({ message: 'Record updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async attatchImage(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const bikeId = req.params.id;
      const bikeImage = req.params.image; // string: link/path to image
      const bike = await Bike.findById(bikeId);
      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
      }
      bike.image = bikeImage;
      await bike.save();
      res.json({ message: 'Record updated successfully' }); // add logger
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = BikeController;
