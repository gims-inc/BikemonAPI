import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-named-as-default
import redisClient from '../utils/redis';
import User from '../models/user';

const { usersLogger } = require('../utils/logger');

// const { getUser } = require('./UsersController');

class AuthController {
  static async getBasicTkn(req, res) {
    const useremail = req.body.email;
    const { password } = req.body;
    if (!useremail) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const hashpwd = sha1(password);
    // console.log(hashpwd);
    try {
      const doc = await User.findOne({ email: useremail });
      if (doc && doc.password === hashpwd) {
        const encodedString = Buffer.from(`${useremail}:${password}`).toString('base64');
        res.status(200).json(`Basic ${encodedString}`);
        usersLogger.info(`user:${doc._id} authenticated`);
      } else {
        res.status(400).json({ error: 'Invalid email or password!' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getConnect(req, res) {
    const authData = req.header('Authorization');
    let userEmail = authData.split(' ')[1];
    const buff = Buffer.from(userEmail, 'base64');
    userEmail = buff.toString('ascii');
    const data = userEmail.split(':');
    if (data.length !== 2) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const hashedPassword = sha1(data[1]);
    // { lean: true }
    await User.findOne({ email: data[0], password: hashedPassword }, async (err, user) => {
      if (user) {
        const token = uuidv4();
        const key = `auth_${token}`;
        /* Use this key for storing in Redis (by using the redisClient create previously)
        the user ID for 24 hours */
        redisClient.set(key, user._id.toString(), 60 * 60 * 24);
        /* Return this token: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" } */
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const id = await redisClient.get(key);
    if (id) {
      await redisClient.del(key);
      res.status(204).json({});
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

//   static async authenticate(req, res, next) {
//     // Check if the user is authenticated
//     const user = await getUser(req, res);
//     if (user) {
//       // User is authenticated, proceed to the next middleware or route handler
//       next();
//     } else {
//       // User is not authenticated, return an error response
//       res.status(401).json({ error: 'Unauthorized' });
//       // return;
//     }
//   }
}

module.exports = AuthController;
