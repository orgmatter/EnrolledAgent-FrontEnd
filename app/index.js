require('dotenv').config({path: '../.env'});

const assert = require('assert');

assert.ok(process.env.SECRET, 'A SECRET must be set in your .env file');

const server = require('./lib');

require('debug')('server');

const port = process.env.APP_PORT || 3000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port', `${port}`);
});
