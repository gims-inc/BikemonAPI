const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bikeid: {
    type: String,
  },
  data: {
    paidby: {
      type: String,
    },
    mode: {
      type: String,
      enum: ['cash', 'mobile'],
    },
    amount: {
      type: String,
      require: true,
    },
    transctid: {
      type: String,
    },
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

module.exports = mongoose.model('Payment', PaymentSchema);
