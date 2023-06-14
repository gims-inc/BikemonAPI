const mongoose = require('mongoose');

const RepairSchema = new mongoose.Schema({
  bikeid: {
    type: String,
  },
  data: {
    type: String,
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
