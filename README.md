# ioredis-encrypted
A wrapper for [ioredis](https://github.com/luin/ioredis) that transparently encrypts and decrypts data stored, using [node-crypt](https://github.com/Stono/node-crypt).

## Getting Started
`ioredis-encrypted` is designed to be a drop in replacement for [ioredis](https://github.com/luin/ioredis), so you should just need to change your require line slightly and just like magic, the data in your redis instance will be secured.

So for starters, install the module with: `npm install ioredis-encrypted`

## Support
**NOTE**: This implementation is limited to a small collection of commands, for my specific requirements.  Sorry, there is only one of me!

  - get/set
  - hset/hget
  - hgetall
  - lpush/lpop
  - rpush/rpop
  - pub/sub
  - pub/psub

All other commands __still work__, they blind proxy through to ioredis, they just won't store encrypted data.

More will be coming, when I have time.  Open to pull requests too ;)

## Examples
I'm expecting that you'll probably have this:

```javascript
const Redis = require('ioredis');
const redis = new Redis();
```

You just need to change it to look like this:

```javascript
const Redis = require('ioredis-encrypted')('your encryption key', 'optional algorithm');
const redis = new Redis();
```

If you don't specify the second argument in the require line, you'll get the default from node-crypt, which is `aes-256-ctr`.

## In Action

Transparent to your application:
```
$ node
> const Redis = require('ioredis-encrypted')('password');
undefined
> const redis = new Redis();
undefined
> redis.set('akey', 'a value');
undefined
> redis.get('akey', (err, data) => { console.log(data); });
> a value
```

However if you look what is stored in redis:
```
$ redis-cli
127.0.0.1:6379> get akey
"ca25c1e77d3689"
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 - 0.1.0 Initial Release
 - 0.1.3 Tidyups and bump version of node-crypt

## License
Copyright (c) 2017 Karl Stoney
Licensed under the Apache-2.0 license.
