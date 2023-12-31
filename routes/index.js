import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import UploadController from '../controllers/UploadController';
import BikeController from '../controllers/BikesController';
import RepairsController from '../controllers/RepairsController';
import RidersController from '../controllers/RidersController';
import PaymentsController from '../controllers/PaymentsController';

const express = require('express');

const api = express.Router();

const moment = require('moment');
const { appLogger } = require('../utils/logger');

const { auth } = require('../middleware/auth');

api.use((req, res, next) => {
  const timestamp = Date.now();
  const formattedDateTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  console.log(`Time: ${formattedDateTime} ${req.path} ${req.method}`);
  appLogger.info(`${req.path} ${req.method}`);
  res.set('Cache-Control', 'no-store'); // disable caching
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
api.get('/riders/index', auth, RidersController.index); // list of riders

api.get('/riders/find/:id', auth, RidersController.findbyId); // rider

api.post('/riders/assign_bike', auth, RidersController.assignBike); // attatch bike to a rider

/*= ================================================================= */
api.get('/bikes/index', auth, BikeController.index);// list of all bike records

api.get('/bikes/search', auth, BikeController.search);// search for a bike

api.post('/bikes/create', auth, BikeController.newBike);// create new record

api.put('/bikes/update', auth, BikeController.updateBike);// update/edid given fields:

api.post('/bikes/delete/:id', auth, BikeController.softDelete);// soft delete

api.post('/bikes/addImage/:id', auth, BikeController.attatchImage);// add bike an image url

/*= ================================================================= */
api.get('/repairs/index', auth, RepairsController.getRepairs);// all recorded rpairs

api.post('/repairs/save', auth, RepairsController.recordRepairs);// new/completed repairs

api.get('/repairs/create', auth, RepairsController.scheduledRepairs);// assign a repair date to a bike

api.get('/repairs/upcoming', auth, RepairsController.upcomingRepairs);// upcoming bike repairs

api.get('/repairs/todays', auth, RepairsController.todaysRepairs);//  current day repairs

/*= ================================================================= */
api.get('/payments/index', auth, PaymentsController.index);// all recorded payments

api.post('/payments/save', auth, PaymentsController.recordPayment);// new payment record.

api.get('/payments/stats', auth, PaymentsController.totalPayments); // total daily/weekly/monthly

/*= ================================================================= */
api.post('/folder/new', auth, UploadController.makeDir);

api.post('/files/upload', auth, UploadController.upload);

/*= ================================================================= */

module.exports = api;
