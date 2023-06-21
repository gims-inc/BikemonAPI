const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['folder', 'image', 'file'],
  },
  userid: {
    type: String,
  },
  parentid: {
    type: String,
    default: '0',
  },
  public: {
    type: Boolean,
    required: true,
  },
  data: {
    type: String,
  },
  localpath: {
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

module.exports = mongoose.model('File', FileSchema);
