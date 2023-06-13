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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('File', FileSchema);
