const moment = require('moment');
const Payments = require('../models/payments');

// Function to get the total amount of DAILY payments
async function getDailyPaymentsTotal() {
  const currentDate = moment().startOf('day'); // Get the current date at the start of the day

  const result = await Payments.aggregate([
    {
      $match: {
        date: {
          $gte: currentDate.toDate(), // Filter payments for the current day and onwards
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: { $toDouble: '$amount' }, // Convert 'amount' to double and calculate the sum
        },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalAmount : 0;
}

// Function to get the total amount of WEEKLY payments
async function getWeeklyPaymentsTotal() {
  const currentWeekStart = moment().startOf('week'); // Get the start of the current week

  const result = await Payments.aggregate([
    {
      $match: {
        date: {
          $gte: currentWeekStart.toDate(), // Filter payments for the current week and onwards
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: { $toDouble: '$amount' }, // Convert 'amount' to double and calculate the sum
        },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalAmount : 0;
}

// Static method to calculate the total amount of Monthly payments
async function getMonthlyPaymentsTotal() {
  const currentMonthStart = moment().startOf('month'); // Get the start of the current month

  const result = await Payments.aggregate([
    {
      $match: {
        date: {
          $gte: currentMonthStart.toDate(), // Filter payments for the current month and onwards
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: { $toDouble: '$amount' }, // Convert 'amount' to double and calculate the sum
        },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalAmount : 0;
}

module.exports = {
  getDailyPaymentsTotal,
  getWeeklyPaymentsTotal,
  getMonthlyPaymentsTotal,
};
