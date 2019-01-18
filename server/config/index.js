'use strict';
const development = process.env.NODE_ENV === 'development',
  production = process.env.NODE_ENV === 'production',
  test = process.env.NODE_ENV === 'test',
  mongoDBLocalUri = 'mongodb://localhost:27017/';

const SERVER_PORT_DEVELOPMENT = process.env.SERVER_PORT_DEVELOPMENT || 3000,
  SERVER_PORT_TEST = process.env.SERVER_PORT_TEST || 3000,
  SERVER_PORT_PRODUCTION = process.env.SERVER_PORT_PRODUCTION || 3000;

const ERRORS = {
  AUTHENTICATION_FAILED: 'Authentication failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DB_ERROR: 'Error happend in DB : ',
  NON_LEXICAL_WORD_EXISTS: ' Non Lexical word already exists',
  TEXT_WORDS_LIMIT: 'Text field must be 100 word long',
  TEXT_CHARACTERS_LIMIT: 'Text field must be 1000 character long'
};

module.exports = {
  SERVER_PORT_NUMBER: development ? SERVER_PORT_DEVELOPMENT : (production ? SERVER_PORT_PRODUCTION : SERVER_PORT_TEST),
  MONGO_DB_URI: process.env.MONGO_DB_URI || mongoDBLocalUri + `lexical_density${development ? '_dev' : (test ? '_test' : '')}`,
  ERRORS
};