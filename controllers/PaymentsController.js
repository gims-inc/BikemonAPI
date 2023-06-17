/* eslint-disable radix */
/* eslint-disable no-unused-vars */
import Payments from '../models/payments';

const { getUser } = require('./UsersController');
const { paginate } = require('../utils/paginate');
const { transactionLogger } = require('../utils/logger');

class PaymentsController {
  static async index(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const items = await Payments.find();

      const currentPage = parseInt(req.query.page) || 1;

      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

      const paginatedItems = paginate(items, currentPage, itemsPerPage);

      res.status(200).json({ payments: paginatedItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async recordPayment(req, res) {
    const user = await getUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { bikeid, date, data } = req.body;

    try {
      const payment = new Payments({
        bikeid,
        date,
        data,
      });
      payment.save((err, result) => {
        res.status(201).json({ id: result.id });
        transactionLogger.info(`New payment record: ${result.id}`);
      });
    } catch (error) {
      console.log(error);
      transactionLogger.error(`payment record creation failed: ${error}`);
    }
  }
}

module.exports = PaymentsController;
