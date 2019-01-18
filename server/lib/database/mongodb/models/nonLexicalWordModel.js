'use strict';
const
  Schema = require('mongoose').Schema;

class NonLexicalWordModel {
  static schema() {
    return new Schema({
      word: String
    });
  }
  static collectionName() {
    return 'nonLexicalWords';
  }
}

module.exports = NonLexicalWordModel;