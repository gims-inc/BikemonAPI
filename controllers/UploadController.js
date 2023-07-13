/* eslint-disable object-shorthand */
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import Queue from 'bull';
import File from '../models/files';
import Folder from '../models/folders';
require('dotenv').config();

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const fileQueue = new Queue('fileQueue', { redis: { port: redisPort, host: redisHost } });

const { transactionLogger } = require('../utils/logger');

class UploadController {
  static async makeDir(req, res) {
    const user = req.userId;
    const { foldername } = req.body;
  
    const filePath = process.env.FOLDER_PATH;
    const folderPath = `${filePath}/${foldername}`;
  
    try {
      await fs.mkdir(folderPath);
    } catch (error) {
      if (error) {
        res.status(400).json({ error: 'Failed to create folder, folder already exists!' });
        transactionLogger.info('error: Failed to create folder!', { meta: error });
        return;
      }
    }
  
    try {
      const folder = new Folder({
        userid: user._id,
        name: foldername,
        localpath: folderPath,
      });
  
      await folder.save();
  
      res.status(201).json({
        id: folder._id,
        path: folderPath,
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'Folder name already exists!' });
        transactionLogger.info('error: Folder name already exists!', { meta: error });
      } else {
        console.log(error);
        transactionLogger.info(error);
      }
    }
  }
  

  static async upload(req, res){

    const user = req.userId; // signed in user

    const { name } = req.body;
    const { type } = req.body;
    const { foldername } = req.body; // owner
    const publicity = req.body.isPublic || false;
    const { data } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name!' });
    }

    const file = await File.findOne({ name: name });
    if (file){
      return res.status(400).json({ error: 'Name already exists!' });
    }

    if (!foldername) {
        return res.status(400).json({ error: 'Missing folder name!' });
    }
    if (!type) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data) {
      return res.status(400).json({ error: 'Missing data' });
    }
    
    const folder = await Folder.findOne({ name: foldername});

    const fileName = `${folder.localpath}/${uuidv4()}`

    //const fileName = `${filePath}/${uuidv4()}`;
      const buff = Buffer.from(data, 'base64');

      //  await fs.writeFile(fileName, buff, 'utf-8');
      try {
        await fs.writeFile(fileName, buff, 'utf-8');
      } catch (error) {
        if (error) {
          res.status(400).json({ error: 'Failed to upload file, file already exists!' });
          transactionLogger.info('error: Upload failed!', { meta: error });
          return;
        }
      }
    
      try {
        const file = new File({
          userid: user._id,
          name: name,
          type: type,
          public: publicity,
          folder: foldername,
          localpath: fileName,
        });
    
        await file.save();

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
    
        res.status(201).json({
          id: file._id,
          path: fileName,
        });
      } catch (error) {
        if (error.code === 11000) {
          res.status(400).json({ error: 'File name already exists!' });
          transactionLogger.info('error: File name already exists!', { meta: error });
        } else {
          console.log(error);
          transactionLogger.info(error);
        }
      }

  }
}

module.exports = UploadController;
