const express = require('express');
var cors = require('cors')
require('dotenv').config()

const server = express();
const port = process.env.APP_PORT;
server.use(express.json({ limit: '10mb' }));

const apiRoutes = require('./routes/index');

const corsOptions = {
  origin: process.env.APP_URL
}

server.use(cors(corsOptions))
server.use('/api/v1', apiRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
