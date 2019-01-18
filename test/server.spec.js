'use strict';

const request = require('supertest-as-promised'),
  _ = require('lodash'),
  chai = require('chai');
chai.should();

const server = require('../server/server'),
  assertData = require('./assertData'),
  config = require('../server/config');

describe('Check Server Routes', () => {
  const oneHundredWords = _.fill(Array(100), 'word ');
  const oneThousandCharacters = _.fill(Array(1000), 'c');
  const testText = 'Kim Loves Going to the cinema';

  before(async () => {
    await assertData.clearExistingData();
    await assertData.importData();
  });
  it('should return lexical density checker when /', async () => {
    const res = await request(server).get('/').expect(200);
    _.get(res, 'text').should.to.be.equal('Lexical Density Checker');
  });

  it('should return Overall Lexical Complexity when /complexity', async () => {
    const res = await request(server).post('/complexity')
      .type('json')
      .send({
        text: testText
      }).expect(200);
    _.get(res, 'body').should.to.be.deep.equal({
      data: {
        overall_ld: '0.67'
      }
    });
  });

  it('should return Overall and Sentences Lexical Complexity when /complexity/:mode', async () => {
    const res = await request(server).post('/complexity/verbose')
      .type('json')
      .send({
        text: testText + '.' + testText
      }).expect(200);
    _.get(res, 'body').should.to.be.deep.equal({
      data: {
        overall_ld: '0.67',
        sentence_ld: ['0.67', '0.67']
      }
    });
  });

  it('should return 500 internal error when mode is not verbose in  /complexity/:mode', async () => {
    const res = await request(server).post('/complexity/v')
      .type('json')
      .send({
        text: testText + '.' + testText
      }).expect(403);
    _.get(res, 'body.err').should.to.be.equal(config.ERRORS.INTERNAL_SERVER_ERROR);
  });

  it('should return 403 status on invalid authentication ', async () => {
    const res = await request(server).post('/nonLexicalWords/new')
      .type('json')
      .set('username', 'Fake')
      .set('password', 'Fake')
      .send({
        type: 'test'
      }).expect(403);
    _.get(res, 'body.err').should.to.be.equal(config.ERRORS.AUTHENTICATION_FAILED);
  });

  it('should return 200 when /nonLexicalWords/new', async () => {
    await request(server).post('/nonLexicalWords/new')
      .type('json')
      .set('username', 'admin')
      .set('password', 'admin')
      .send({
        word: 'abc'
      }).expect(200);
  });

  it('should return error if word already exists when /nonLexicalWords/new', async () => {
    const res = await request(server).post('/nonLexicalWords/new')
      .type('json')
      .set('username', 'admin')
      .set('password', 'admin')
      .send({
        word: 'got'
      }).expect(403);
    _.get(res, 'body.err').should.to.be.equal(config.ERRORS.NON_LEXICAL_WORD_EXISTS);
  });

  it('should throw error when words length is > 100 in both routes', async () => {

    const res = await request(server).post('/complexity')
      .type('json')
      .send({
        text: oneHundredWords
      }).expect(403);

    _.get(res, 'body.err.text.msg').should.to.be.equal(config.ERRORS.TEXT_WORDS_LIMIT);
    await request(server).post('/complexity/:mode')
      .type('json')
      .send({
        text: oneHundredWords
      }).expect(403);
  });

  it('should throw error when characters length is > 1000 in both routes', async () => {

    const res = await request(server).post('/complexity')
      .type('json')
      .send({
        text: oneThousandCharacters
      }).expect(403);
    _.get(res, 'body.err.text.msg').should.to.be.equal(config.ERRORS.TEXT_CHARACTERS_LIMIT);
    await request(server).post('/complexity/:mode')
      .type('json')
      .send({
        text: oneThousandCharacters
      }).expect(403);
  });

});
