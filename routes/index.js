import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import UploadController from '../controllers/UploadController';
import BikeController from '../controllers/BikesController';
import RepairsController from '../controllers/RepairsController';
import RidersController from '../controllers/RidersController';
// import Auth from '../middleware/auth';

const express = require('express');

const api = express.Router();

const { appLogger } = require('../utils/logger');

// const { authenticate } = require('../controllers/AuthController');

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
api.get('/riders/index', RidersController.index);

/*= ================================================================= */
api.get('/bikes/index', BikeController.index);

api.post('/bikes/create', BikeController.newBike);

api.post('/bikes/update', BikeController.updateBike);

api.post('/bikes/delete', BikeController.softDelete);

api.post('/bikes/addImage', BikeController.attatchImage);

/*= ================================================================= */
api.get('/repairs/index', RepairsController.getRepair);

api.post('/repairs/create', RepairsController.scheduledRepair);

/*= ================================================================= */
api.post('/files', UploadController.postUpload);

/*= ================================================================= */

module.exports = api;
