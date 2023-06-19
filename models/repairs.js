// const moment = require('moment');
const mongoose = require('mongoose');

const RepairSchema = new mongoose.Schema({
  bikeid: {
    type: String,
  },
  date: {
    type: Date,
    // get(value) {
    //   return value ? moment(value).format('YYYY-MM-DD') : null;
    // },
    // set(value) {
    //   return value ? moment(value, 'YYYY-MM-DD').toDate() : null;
    // },
  },
  description: {
    type: String,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Repair', RepairSchema);
