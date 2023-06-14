import redisClient from '../utils/redis';
import DbClient from '../utils/db';
import ModelCounter from '../utils/count';

class AppController {
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: DbClient.isAlive(),
    });
  }

  static getStats(req, res) {
    Promise.all([
      ModelCounter.nbUsers(),
      ModelCounter.nbFiles(),
      ModelCounter.nbBikes(),
      ModelCounter.nbTrackers(),
    ])
      .then(([
        usersCount,
        filesCount,
        bikeCount,
        trackerCount,
      ]) => {
        res.status(200).json({
          users: usersCount,
          files: filesCount,
          bikes: bikeCount,
          trackers: trackerCount,
        });
      });
  }
}

module.exports = AppController;
