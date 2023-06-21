/* eslint-disable object-shorthand */
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import Queue from 'bull';
import UsersController from './UsersController';
import File from '../models/files';

// const mongoose = require('mongoose');

// const { ObjectId } = mongoose.Types;

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;

const fileQueue = new Queue('fileQueue', { redis: { port: redisPort, host: redisHost } });

const { transactionLogger } = require('../utils/logger');

class UploadController {
  static async postUpload(req, res) {
    const user = await UsersController.getUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { name } = req.body;
    const { type } = req.body;
    const { parentId } = req.body; // owner
    const isPublic = req.body.isPublic || false;
    const { data } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId) {
      // const idObject = ObjectId(parentId);
      const file = await File.findOne({ _id: parentId, userid: user._id }); //  here
      if (!file) {
        console.log(`parentId:${parentId}`); // debug
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    if (type === 'folder') {
      // eslint-disable-next-line object-shorthand
      File.collection.insertOne(
        {
          userid: user._id,
          name: name,
          type: type,
          parentid: parentId || 0,
          public: isPublic,
        }, (err, result) => {
          if (result) {
            res.status(201).json({
              id: result.insertedId,
              userid: user._id,
              name: name,
              type: type,
              public: isPublic,
              parentid: parentId || 0,
            });
          } else {
            console.log(err);
            transactionLogger.info(err);
          }
        },
      );
    } else {
      const filePath = process.env.FOLDER_PATH || '/tmp/bikemon_files';
      // Create a local path in the storing folder with filename a UUID
      const fileName = `${filePath}/${uuidv4()}`;
      const buff = Buffer.from(data, 'base64');

      try {
        try {
          await fs.mkdir(filePath);
        } catch (error) {
          transactionLogger.info(error);
        }
        await fs.writeFile(fileName, buff, 'utf-8');
      } catch (error) {
        console.log(error);
        transactionLogger.info(error);
      }

      File.collection.insertOne(
        {
          userid: user._id,
          name: name,
          type: type,
          parentid: parentId || 0,
          public: isPublic,
          localpath: fileName,
        }, (err, result) => {
          if (result) {
            res.status(201).json({
              id: result.insertedId,
              userid: user._id,
              name: name,
              type: type,
              public: isPublic,
              parentid: parentId || 0,
            });

            if (type === 'image') {
              fileQueue.add(
                {
                  userId: user._id,
                  fileId: result.insertedId,
                },
              );
            } else {
              console.log(err);
              transactionLogger.info(err);
            }
          }
        },
      );
    }
    return null;
  }
}

module.exports = UploadController;
