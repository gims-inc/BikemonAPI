const mongoose = require('mongoose');

const TrackerSchema = new mongoose.Schema({
  bikeid: {
    type: String,
  },
  data: {
    type: String,
  },
  status: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tracker', TrackerSchema);
