import User from '../models/user';
import File from '../models/files';
import Bike from '../models/bikes';
import Tracker from '../models/trackers';

class ModelCounter {
  static async nbUsers() {
    try {
      const count = await User.countDocuments();
      return count;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  static async nbFiles() {
    try {
      const count = File.countDocuments();
      return count;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  static async nbBikes() {
    try {
      const count = Bike.countDocuments();
      return count;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  static async nbTrackers() {
    try {
      const count = Tracker.countDocuments();
      return count;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }
}

module.exports = ModelCounter;
