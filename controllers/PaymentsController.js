/* eslint-disable prefer-destructuring */
/* eslint-disable object-shorthand */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */
import Payments from '../models/payments';
import Bikes from '../models/bikes';
import transformInput from '../utils/cleanNumberPlate';
import paginate from '../utils/paginate';

const moment = require('moment');
const { getDailyPaymentsTotal, getWeeklyPaymentsTotal, getMonthlyPaymentsTotal } = require('../utils/paymentsAggregater');

const { getUser } = require('./UsersController');
const { transactionLogger } = require('../utils/logger');

class PaymentsController {
  static async index(req, res) {
    const user = await getUser(req); // uncoment
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
    const user = await getUser(req); // uncomment
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { bikeNum, date, data } = req.body;

    const clean = transformInput(bikeNum);
    console.log(`Search: ${clean}`);

    const bike = await Bikes.findOne({
      plate: clean,
    }); // find by plate reeturn id

    if (!bike) {
      res.status(401).json({ error: 'Check the bike plate number and try again!' });
      return;
    }
    // const bikeid = bike;
    const newDate = moment(date, 'YYYY-MM-DD');
    console.log(`new date: ${newDate}`); // debug
    if (!newDate.isValid()) {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    try {
      const payment = new Payments({
        bikeid: bike._id,
        date: newDate,
        paidby: data.paidby,
        mode: data.mode,
        amount: data.amount,
        transactid: data.transactid,
      });
      console.log(`payment data:${payment}`); // debug
      payment.save((err, result) => {
        res.status(201).json({ plate: bikeNum, amount: result.amount });

        const additionalData = {
          user: data.paidBy, // undo
          data: result.id,
        };

        transactionLogger.info(`New payment record: ${clean}`, { meta: additionalData });
      });
    } catch (error) {
      console.log(error);
      transactionLogger.error('payment record creation failed', { meta: error });
    }
  }

  // static async totalPayments(req, res) {
  //   try {
  //     const dailyTotal = await getDailyPaymentsTotal();
  //     const weeklyTotal = await getWeeklyPaymentsTotal();
  //     const monthlyTotal = await getMonthlyPaymentsTotal();
  //     const totals = {};
  //     totals.daily = Number(dailyTotal);
  //     totals.weekly = Number(weeklyTotal);
  //     totals.monthly = Number(monthlyTotal);

  //     // Sending the totals as a response
  //     return res.status(200).json({ totals });
  //   } catch (error) {
  //     // Handle any errors that occurred during the calculation or response
  //     return res.status(500).json({ error: 'An error occurred' });
  //   }
  // }

  static async totalPayments(req, res) { // auth v1.1
    // const user = await getUser(req); // uncoment
    // if (!user) {
    //   res.status(401).json({ error: 'Unauthorized' });
    //   return;
    // }

    // console.log(`Access the user from middleware request object: ${req.userId}`);

    try {
      const [dailyTotal, weeklyTotal, monthlyTotal] = await Promise.all([
        getDailyPaymentsTotal(),
        getWeeklyPaymentsTotal(),
        getMonthlyPaymentsTotal(),
      ]);

      const totals = {
        daily: Number(dailyTotal),
        weekly: Number(weeklyTotal),
        monthly: Number(monthlyTotal),
      };

      // Sending the totals as a response
      Promise.resolve(res.status(200).json(totals));
    } catch (error) {
      // Handle any errors that occurred during the calculation or response
      console.log(`total payments error ${error}`);
      Promise.resolve(res.status(500).json({ error: 'An error occurred' }));
    }
  }
}

module.exports = PaymentsController;
