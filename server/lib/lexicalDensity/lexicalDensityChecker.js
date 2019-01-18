'use strict';

/**
 *@class Class LexicalDensityChecker
 *@summary Responsible for checking Lexicall Density of Texts
 */

const _ = require('lodash');

const _nonLexicalWordsDB = Symbol('nonLexicalWordsDB'),
  _getSentenceLD = Symbol('getSentenceLD'),
  _getSentencesLD = Symbol('getSentencesLD'),
  _getOverallLD = Symbol('getOverallLD');

class LexicalDensityChecker {
  constructor(nonLexicalWordsDB) {
    this[_nonLexicalWordsDB] = nonLexicalWordsDB;
  }

  /** a private method
   * @desc calculates sentence lexical density
   * @param sentence provided sentence
   * @returns sentenceLD
   */
  async [_getSentenceLD](sentence) {
    const words = _.split(sentence, ' ');
    _.remove(words, (word) => {
      return word === '';
    });
    const nonLDWordsCount = await this[_nonLexicalWordsDB].getNotLexicalWordCount(words);
    return ((_.size(words) - nonLDWordsCount) / _.size(words)).toFixed(2);
  }

  /** a private method
   * @desc calculates sentences lexical density of a text
   * @param text provided text
   * @param sentenceSeperator default is '.'
   * @returns sentencesLd []
   */

  async [_getSentencesLD](text, sentenceSeperator) {
    const sentences = _.split(text, sentenceSeperator);
    const sentencesLd = [];
    for (const sentence of sentences) {
      if (_.size(sentence) > 0 && sentence !== '') {
        sentencesLd.push(await this[_getSentenceLD](sentence));
      }
    }
    return sentencesLd;
  }

  /** a private method
   * @desc calculates overall lexical density of a text
   * @param text provided text
   * @param sentenceSeperator default is '.'
   * @returns overallLD
   */

  [_getOverallLD](text, sentenceSeperator) {
    return this[_getSentenceLD](_.replace(text, sentenceSeperator, ' '));
  }

  /** a public method
   * @desc calculates overall lexical density of a text
   * @param text provided text
   * @param sentenceSeperator default is '.'
   * @returns overall lexical density of the text
   */
  async overallLexicalDensity(text, sentenceSeperator = '.') {
    // validations
    const overallLD = await this[_getOverallLD](text, sentenceSeperator);
    return {
      overallLD
    };
  }

  /** a public method
   * @desc calculates sentenceLD and overallLD of a text
   * @param text provided text
   * @param sentenceSeperator default is '.'
   * @returns {sentenceLD:[], overallLD:number}
   */
  async detailedLexicalDensity(text, sentenceSeperator = '.') {

    const sentenceLD = await this[_getSentencesLD](text, sentenceSeperator);
    const overallLD = await this[_getOverallLD](text, sentenceSeperator);
    return {
      sentenceLD, overallLD
    }
  }

  /** a public method
   * @desc defines and adds a new Non Lexical Word
   * @param word provided word
   * @returns
   */
  async defineNewNonLexicalWord(word) {
    await this[_nonLexicalWordsDB].defineNewNonLexicalWord(word);
  }

  /** a public method
   * @desc removes all non lexical words
   * @returns
   */
  async removeNonLexicalWords() {
    await this[_nonLexicalWordsDB].removeNonLexicalWords();
  }
}

module.exports = LexicalDensityChecker;