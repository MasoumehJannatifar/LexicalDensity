'use strict';

/**
 * @summary Controller for working with server.js and LexicalDensityFactory
 */

const LexicalDensityFactory = require('../lib/lexicalDensity/lexicalDensityFactory');

module.exports = {
  overallLexicalDensity: async (text) => {
    const result = await LexicalDensityFactory.getLexicalDensityChecker().overallLexicalDensity(text);
    return {
      data: {
        overall_ld: result.overallLD
      }
    }
  }, detailedLexicalDensity: async (text) => {
    const result = await LexicalDensityFactory.getLexicalDensityChecker().detailedLexicalDensity(text);
    return {
      data: {
        overall_ld: result.overallLD,
        sentence_ld: result.sentenceLD
      }
    }
  },
  defineNewNonLexicalWord: async (word) => {
    await LexicalDensityFactory.getLexicalDensityChecker().defineNewNonLexicalWord(word);
  },
  removeNonLexicalWords: async () => {
    await LexicalDensityFactory.getLexicalDensityChecker().removeNonLexicalWords();
  }
};