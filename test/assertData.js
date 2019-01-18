const controller = require('../server/lib');
const testNonLexicalWords = ['the', 'to', 'got'];
module.exports = {
  importData: async () => {
    for (const nonLexicalWord of testNonLexicalWords) {
      await controller.defineNewNonLexicalWord((nonLexicalWord));
    }
  },
  clearExistingData: async () => {
    await controller.removeNonLexicalWords();
  }
};