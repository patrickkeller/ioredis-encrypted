'use strict';
const should = require('should');
const Crypto = require('node-crypt');
const EncryptedRedis = require('../')('password');
const Redis = require('ioredis');

describe('Redis', () => {
  describe('Encryption', () => {
    let client, encryptedClient, crypto;
    before(() => {
      crypto = new Crypto({
        key: 'password'
      });
      encryptedClient = new EncryptedRedis();
      client = new Redis();
    });

    it('shouldnt bomb on null values', done => {
      client.del('test', () => {
        encryptedClient.get('test', (err, result) => {
          should.ifError(err);
          should(result).eql(null);
          done();
        });
      });
    });

    it('set/get <key> <value> should store an encrypted value', done => {
      const testValue = Date.now().toString();
      encryptedClient.set('test', testValue, () => {
        client.get('test', (err, result) => {
          should.ifError(err);
          should(result).eql(crypto.encrypt(testValue));
          encryptedClient.get('test', (err, result) => {
            should.ifError(err);
            should(result).eql(testValue);
            done();
          });
        });
      });
    });

    it('hset/hget <hash> <key> <value> should store an encrypted value', done => {
      const testValue = Date.now().toString();
      encryptedClient.hset('hashname', 'test', testValue, () => {
        client.hget('hashname', 'test', (err, result) => {
          should.ifError(err);
          should(result).eql(crypto.encrypt(testValue));
          encryptedClient.hget('hashname', 'test', (err, result) => {
            should.ifError(err);
            should(result).eql(testValue);
            done();
          });
        });
      });
    });

    it('hgetall should return unencrypted values', done => {
      const testValue = Date.now().toString();
      encryptedClient.hset('hashname', 'test', testValue, () => {
        client.hget('hashname', 'test', err => {
          should.ifError(err);
          encryptedClient.hgetall('hashname', (err, results) => {
            should.ifError(err);
            should(results.test).eql(testValue);
            done();
          });
        });
      });
    });

  });
});
