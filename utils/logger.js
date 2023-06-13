const { createLogger, format, transports } = require('winston');
require('winston-mongodb'); // Require the winston-mongodb transport

const appLogger = createLogger({
  transports: [
    new transports.MongoDB({
      level: 'info',
      db: 'mongodb://localhost:27017/bikemon_logs',
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      collection: 'app_logs',
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.json(),
      ),
    }),
  ],
});

const usersLogger = createLogger({
  transports: [
    new transports.MongoDB({
      level: 'info',
      db: 'mongodb://localhost:27017/bikemon_logs',
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      collection: 'user_logs',
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.json(),
      ),
    }),
  ],
});

const transactionLogger = createLogger({
  transports: [
    new transports.MongoDB({
      level: 'info',
      db: 'mongodb://localhost:27017/bikemon_logs',
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      collection: 'transaction_logs',
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.json(),
      ),
    }),
  ],
});

module.exports = {
  appLogger,
  usersLogger,
  transactionLogger,
};
