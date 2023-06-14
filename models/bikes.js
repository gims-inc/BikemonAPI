const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema({
  plate: {
    type: String,
    unique: true,
  },
  userid: {
    type: String,
  },
  trackerid: {
    type: String,
  },
  repairs: {
    scheduledrepair: {
      type: String,
    },
    previousrepair: {
      type: String,
    },
  },
  description: {
    type: String,
  },
  image: {
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

module.exports = mongoose.model('Bike', BikeSchema);
