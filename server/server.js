'use strict';

/**
 * @summary Server.js Responsible for handling Routes
 */

const express = require('express'),
  router = express.Router(),
  server = express(),
  bodyparser = require('body-parser'),
  {body, validationResult} = require('express-validator/check'),
  _ = require('lodash');

const config = require('./config'),
  lexicalDensityFactory = require('./lib');


const validateInputMiddleware = [
  body('text').custom((value) => {
    const text = _.replace(value, '.', ' ');
    if (_.size(_.split(text, ' ')) > 100) {
      throw new Error(config.ERRORS.TEXT_WORDS_LIMIT);
    }
    if (_.size(text) > 1000) {
      throw new Error(config.ERRORS.TEXT_CHARACTERS_LIMIT);
    }
    return true;
  })
];

const validationErrorHandling = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(errors.mapped())
  }
  next();
};
const checkAuthentication = (req, res, next) => {
  try {
    const username = req.get('username');
    const password = req.get('password');
    if (username === 'admin' && password === 'admin') {
      next();
    } else {
      next(config.ERRORS.AUTHENTICATION_FAILED);
    }
  } catch (error) {
    next(config.ERRORS.AUTHENTICATION_FAILED);
  }
};

router.use(bodyparser.json({
  limit: '1mb'
}));

router.get('/', (req, res) => {
  res.send('Lexical Density Checker');
});

router.post('/complexity', validateInputMiddleware, validationErrorHandling, async (req, res, next) => {
  try {
    res.json(await lexicalDensityFactory.overallLexicalDensity(_.get(req, 'body.text', '')));
  } catch (error) {
    next(config.ERRORS.INTERNAL_SERVER_ERROR);
  }
});

router.post('/complexity/:mode', validateInputMiddleware, validationErrorHandling, async (req, res, next) => {
  try {
    if (_.get(req,'params.mode') !== 'verbose') {
      throw config.ERRORS.INTERNAL_SERVER_ERROR;
    }
    res.json(await lexicalDensityFactory.detailedLexicalDensity(_.get(req, 'body.text', '')));
  } catch (error) {
    next(config.ERRORS.INTERNAL_SERVER_ERROR);
  }
});

router.post('/nonLexicalWords/new', checkAuthentication, async (req, res, next) => {
  try {
    res.json(await lexicalDensityFactory.defineNewNonLexicalWord(_.get(req, 'body.word', '')));
  } catch (error) {
    next(error);
  }
});

server.use('/', router);

server.use(function (err, req, res, next) {
  res.status(403).send({
    err
  });
  next();
});

server.listen(config.SERVER_PORT_NUMBER, () => {
  console.log(`Lexical Density Checker Is Running At Port ${config.SERVER_PORT_NUMBER}`);
});

module.exports = server;