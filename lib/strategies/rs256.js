'use strict';

const crypto = require('node:crypto');
const { BaseStrategy } = require('./base-strategy.js');
const {
  InvalidSignatureError,
} = require('../errors/invalid-signature-error.js');

/**
 * Strategy for RS256 asymmetric hashing algorithm
 */
class RS256Strategy extends BaseStrategy {
  #publicKey;
  #privateKey;

  constructor(options) {
    const header = { alg: 'RS256', typ: 'JWT' };
    super({ header, ttl: options.ttl });
    this.#publicKey = options.publicKey;
    this.#privateKey = options.privateKey;
  }

  sign(unsigned, options = {}) {
    const privateKey = options.privateKey || this.#privateKey;

    const b64uSigned = crypto
      .createSign('RSA-SHA256')
      .update(unsigned)
      .sign(privateKey, 'base64url');
    return b64uSigned;
  }

  validateSignature(unsigned, candidate, options = {}) {
    const publicKey = options.publicKey || this.#publicKey;

    const validated = crypto
      .createVerify('RSA-SHA256')
      .update(unsigned)
      .verify(publicKey, candidate, 'base64url');
    if (!validated) {
      throw new InvalidSignatureError();
    }
    return validated;
  }
}

module.exports = { RS256Strategy };
