'use strict';

/**
 *@class LexicalDensityFactory
 *@summary Singleton Pattern, Responsible for initializing lexical density checker object
 */

const constants = require('../../config');
const MongoDB = require('../database/mongodb/mongoDB'),
  LexicalDensityChecker = require('./lexicalDensityChecker');

class LexicalDensityFactory {
  static getLexicalDensityChecker() {
    const database = new MongoDB(constants.MONGO_DB_URI);
    return new LexicalDensityChecker(database);
  }
}

module.exports = LexicalDensityFactory;