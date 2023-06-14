/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import Bike from '../models/bikes';

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const { getUser } = require('./UsersController');
const { transactionLogger } = require('../utils/logger');

//  const { authenticate } = require('./AuthController');

class BikeController {
  static async index(req, res) { // paginate
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const bikes = Bike.find();
    res.status(200).json({ items: bikes });
  }

  static async newBike(req, res) { // paginate
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      plate, trackerid, repairs, description, image,
    } = req.body;

    await Bike.findOne({ plate: plate }, (err, doc) => {
      if (doc) {
        res.status(400).json({ error: 'Record already exist' });
      } else {
        try {
          const newBike = new Bike({
            plate, // toLowerCase().replace(/\s/g, '');
            userid: user._id,
            description,
            image,
          });
          newBike.save((err, result) => {
            res.status(201).json({ id: result.id });
            transactionLogger.info(`New Bike: ${result.id}`);
          });
        } catch (error) {
          console.log(error);
          transactionLogger.error(`Bike record creation failed: ${error}`);
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
    if (user.designation === 'rider') {
      res.status(400).json({ error: 'Not allowed' });
      return;
    }
    try {
      const { id } = req.params;
      const { plate } = req.params;
      const bike = await Bike.findOne({ _id: ObjectId(id), plate: plate });
      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
      }
      // bike.plate = req.body.plate;
      bike.userid = user._id;
      bike.description = req.body.description;
      bike.image = req.body.image;
      await bike.save();
      res.json({ message: 'Record updated successfully' });
      transactionLogger.info(`Bike record updated by: ${user._id}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      transactionLogger.error(`Record update failed: ${error}`);
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
      const bikeImage = req.params.image;
      const bike = await Bike.findById(bikeId);
      if (!bike) {
        res.status(404).json({ error: 'Record not found' });
      }
      bike.image = bikeImage;
      await bike.save();
      res.json({ message: 'Record updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = BikeController;
