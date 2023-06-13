import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import UploadController from '../controllers/UploadController';

const express = require('express');

const api = express.Router();

const { appLogger } = require('../utils/logger');

api.use((req, res, next) => {
  console.log(`Time:${Date.now()} ${req.path} ${req.method}`); // debug+delete
  appLogger.info(`${req.path} ${req.method}`);
  next();
});

/*= ============================================================== */
api.post('/auth', AuthController.getBasicTkn);

api.get('/connect', AuthController.getConnect);

api.get('/disconnect', AuthController.getDisconnect);

/*= ============================================================== */
api.get('/status', AppController.getStatus);

api.get('/stats', AppController.getStats);

/*= ================================================================ */
api.post('/users', UsersController.newUser);

api.get('/users/me', UsersController.getMe);

/*= ================================================================= */
api.post('/files', UploadController.postUpload);

/*= ================================================================= */

module.exports = api;
