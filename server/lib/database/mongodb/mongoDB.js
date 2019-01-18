'use strict';

/**
 * @class MongoDB
 * @summary Responsible for handling monogdb operation, inherits from Database
 */

const mongoose = require('mongoose'),
  _ = require('lodash');

const Database = require('../database'),
  config = require('../../../config');

const _connectionUri = Symbol('connectionUri'),
  _connection = Symbol('connection'),
  _models = Symbol('models'),
  _getConnection = Symbol('getConnection'),
  _getModel = Symbol('getModel');


class MongoDB extends Database {
  constructor(connectionUri) {
    super();
    mongoose.promise = Promise;
    this.mongoose = mongoose;
    this[_connectionUri] = connectionUri;
    this[_connection] = null;
    this[_models] = [];
  }

  /** a private method
   * @desc creates and returns mongoDB connection
   * @returns monogDB connection
   */

  [_getConnection]() {
    try {
      if (this[_connection]) {
        return this[_connection];
      }
      this[_connection] = mongoose.createConnection(this[_connectionUri], {useNewUrlParser: true});
      return this[_connection];
    } catch (err) {
      throw config.ERRORS.DB_ERROR + err;
    }
  }

  /** a private method
   * @desc get models predefined in models
   * @returns monogDB model
   */
  [_getModel](model) {
    try {
      const modelObject = require(__dirname + '/models/' + model + 'Model.js');
      const mongooseModel = (this[_getConnection]()).model(model, modelObject.schema(), modelObject.collectionName());
      return mongooseModel;
    } catch (err) {
      throw config.ERRORS.DB_ERROR + err;
    }
  }

  /** a public method
   * @desc overwrites super.getNotLexicalWordCount
   * @param words to be checked if are nonLexical or not
   * @returns number of nonLexicalWords
   */
  async getNotLexicalWordCount(words) {
    words = _.map(words, (word) => {
      return _.lowerCase(word);
    });
    // group by for counting duplicates
    const wordGroupCounts = _.reduce(words, (occurrences, item) => {
      if (!occurrences.hasOwnProperty(item)) {
        occurrences[item] = 0;
      }
      occurrences[item]++;
      return occurrences;
    }, {});
    try {
      const nonLexicalWordDocs = await this[_getModel]('nonLexicalWord').find({'word': {$in: words}}).exec();
      let nonLexicalWordsCount = 0;
      _.forEach(nonLexicalWordDocs, (doc) => {
        nonLexicalWordsCount += wordGroupCounts[_.get(doc, 'word').toString()];
      });
      return nonLexicalWordsCount;
    } catch (err) {
      throw config.ERRORS.DB_ERROR + err;
    }
  }

  /** a public method
   * @desc overwrites super.defineNewNonLexicalWord
   * @param word to be be added to mongoDB
   * @return error if the word already exists
   */

  async defineNewNonLexicalWord(word) {
    word = _.lowerCase(word);
    try {
      const nonLexicalWordDoc = await this[_getModel]('nonLexicalWord').findOne({'word': word});
      if (nonLexicalWordDoc) {
        throw config.ERRORS.NON_LEXICAL_WORD_EXISTS;
      }
      const model = new (this[_getModel]('nonLexicalWord'))({word});
      await model.save();
    } catch (err) {
      throw err;
    }
  }


  /** a public method
   * @desc overwrites super.removeNonLexicalWords
   */
  async removeNonLexicalWords() {
    try {
      await this[_getModel]('nonLexicalWord').deleteMany({});
    } catch (err) {
      throw config.ERRORS.DB_ERROR + err;
    }
  }
}

module.exports = MongoDB;