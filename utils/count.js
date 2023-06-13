import User from '../models/user';
import File from '../models/files';

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
}

module.exports = ModelCounter;
