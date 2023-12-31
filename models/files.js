const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    enum: [ 'image', 'file','doc'],
  },
  userid: {
    type: String,
  },
  public: {
    type: Boolean,
    default: false,
  },
  folder: {
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
