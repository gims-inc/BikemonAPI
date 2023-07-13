const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  userid: {
    type: String,
  },
  public: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model('Folder', FolderSchema);

// db.collection.drop()
// db.collection.distinct()