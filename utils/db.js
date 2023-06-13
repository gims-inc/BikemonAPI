const mongoose = require('mongoose');
// const dotenv = require('dotenv');

class DBClient {
  constructor() {
    const HOST = process.env.DB_HOST;
    // eslint-disable-next-line radix
    const PORT = parseInt(process.env.DB_PORT);
    const DBNAME = process.env.DB_DATABASE;

    function dbURL(host = 'localhost', port = 27017) {
      const urlStr = `mongodb://${host}:${port}`;
      return urlStr;
    }

    this.connected = false;
    this.db = null;

    mongoose.connect(`${dbURL(HOST, PORT)}/${DBNAME || 'bikemon'}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { connection } = mongoose;
    connection.on('error', (error) => {
      console.error(`MongoDB connection error: ${error}`);
    });
    connection.once('open', () => {
      this.connected = true;
      this.db = connection.db;
      console.log('<Connected:MongoDB>');
    });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    const usersCollection = this.db.collection('users');
    try {
      const count = await usersCollection.countDocuments();
      return count;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  async nbFiles() {
    const filesCollection = this.db.collection('files');
    try {
      const count = await filesCollection.countDocuments();
      return count;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }
}

module.exports = new DBClient();
