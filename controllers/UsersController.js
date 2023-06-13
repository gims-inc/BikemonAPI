/* eslint-disable no-unused-vars */
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import User from '../models/user';

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const Queue = require('bull');

const { usersLogger, transactionLogger } = require('../utils/logger');

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;

const userQueue = new Queue('userQueue', { redis: { port: redisPort, host: redisHost } });

class UsersController {
  static async newUser(req, res) {
    const parameters = ['firstname', 'lastname', 'username', 'email', 'password'];
    const missingParameters = [];

    parameters.forEach((param) => {
      if (!req.body || !req.body[param]) {
        missingParameters.push(param);
      }
    });

    if (missingParameters.length > 0) {
      // Handle missing parameters
      console.log('Missing parameters:', missingParameters);
      res.status(400).json({ error: `Missing parameters:', ${missingParameters}` });
      return;
    }
    const userfirstName = req.body ? req.body.firstname : null;
    const userlastName = req.body ? req.body.lastname : null;
    const userUserName = req.body ? req.body.username : null;
    const useremail = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    // eslint-disable-next-line object-shorthand
    await User.findOne({ email: useremail }, (err, doc) => {
      if (doc) {
        res.status(400).json({ error: 'User already exist' });
      } else {
        try {
          const hashedPassword = sha1(password);
          const user = User({
            userName: userUserName,
            firstName: userfirstName,
            lastName: userlastName,
            email: useremail,
            password: hashedPassword,
          });
          user.save((err, result) => {
            res.status(201).json({ id: result.id, useremail });
            userQueue.add({ userId: result.id });
            usersLogger.info(`New user: ${result.id}`);
          });
        } catch (error) {
          console.log(error);
          transactionLogger.error(`user creation failed: ${error}`);
        }
      }
    });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (userId) {
      const idObject = ObjectId(userId);

      await User.findOne({ _id: idObject }, (err, user) => {
        if (user) {
          res.status(200).json({ id: userId, email: user.email });
        } else {
          res.status(401).json({ error: 'Unauthorized' });
        }
      });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  static async getUser(req, res) {
    // get a connected user
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const idObject = ObjectId(userId);
      const user = await User.findById({ _id: idObject });
      if (!user) {
        return null;
      }
      return user;
    }
    return null;
  }
}

module.exports = UsersController;
