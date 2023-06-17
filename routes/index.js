import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import UploadController from '../controllers/UploadController';
import BikeController from '../controllers/BikesController';
import RepairsController from '../controllers/RepairsController';
import RidersController from '../controllers/RidersController';
import PaymentsController from '../controllers/PaymentsController';
// import Auth from '../middleware/auth';

const express = require('express');

const api = express.Router();

const moment = require('moment');
const { appLogger } = require('../utils/logger');

// const { authenticate } = require('../controllers/AuthController');

api.use((req, res, next) => {
  const timestamp = Date.now();
  const formattedDateTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  console.log(`Time: ${formattedDateTime} ${req.path} ${req.method}`);
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
api.get('/riders/index', RidersController.index); // list of riders

api.get('/riders/find/:id', RidersController.findbyId); // rider

api.post('/riders/assign_bike', RidersController.assignBike); // attatch bike to a rider

/*= ================================================================= */
api.get('/bikes/index', BikeController.index);// list of all bike records

api.get('/bikes/search', BikeController.search);// search for a bike

api.post('/bikes/create', BikeController.newBike);// create new record

api.put('/bikes/update', BikeController.updateBike);// update/edid given fields:

api.post('/bikes/delete/:id', BikeController.softDelete);// soft delete

api.post('/bikes/addImage/:id', BikeController.attatchImage);// add bike an image url

/*= ================================================================= */
api.get('/repairs/index', RepairsController.getRepairs);// all recorded rpairs

api.post('/repairs/save', RepairsController.recordRepairs);// new/completed repairs

api.get('/repairs/create', RepairsController.scheduledRepairs);// assign a repair date to a bike

api.post('/repairs/upcoming', RepairsController.upcomingRepairs);// upcoming bike repairs

api.post('/repairs/todays', RepairsController.todaysRepairs);//  current day repairs

/*= ================================================================= */
api.get('/payments/index', PaymentsController.index);// all recorded payments

api.post('/payments/save', PaymentsController.recordPayment);// new payment record.

/*= ================================================================= */
api.post('/files/upload', UploadController.postUpload);

/*= ================================================================= */

module.exports = api;
