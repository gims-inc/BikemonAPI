import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.connected = true;

    this.client.on('connect', () => {
      console.log('<Redis init>');
      this.connected = true;
    });

    this.client.on('error', (err) => {
      console.log(`Error:${err}`);
      this.connected = false;
    });
  }

  isAlive() {
    return this.connected;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.GET(key, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  set(key, value, expiration) {
    return new Promise((resolve, reject) => {
      this.client.SET(key, value, 'EX', expiration, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  del(key) {
    return new Promise((resolve, reject) => {
      this.client.DEL(key, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
