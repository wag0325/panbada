/* eslint-disable no-console */

import express from 'express';
import { createServer } from 'http';

import './src/config/db';
import constants from './src/config/constants';
import middlewares from './src/config/middlewares';
// import mocks from './mocks';

const app = express();

// which port to run
// const PORT = process.env.PORT || 3000;
middlewares(app);

const graphQLServer = createServer(app);

// mocks().then(() => {
  graphQLServer.listen(constants.PORT, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`App listen to port: ${constants.PORT}`);
    }
  });
// });
