import * as cacheManager from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClient } from 'redis';
import * as bluebird from 'bluebird';

export const redisConn = {
  store: redisStore,
  host: 'localhost', // default value
  port: 6379, // default value
  ttl: 36000,
  db: 0,
  // auth_pass: 'XXXXX',
} as cacheManager.StoreConfig;
export const redisCache = cacheManager.caching(redisConn);
export const redisClient = (redisCache as any).store.getClient() as RedisClient;
bluebird.promisifyAll(redisClient);

redisClient.on('error', error => {
  // listen for redis connection error event
  console.log('===========');
  console.log(error);
  console.log('===========');
});

// var ttl = 5;
// redisCache.set('foo', 'bar', { ttl: ttl }, err => {
//   if (err) {
//     throw err;
//   }

//   redisCache.get('foo', (err, result) => {
//     console.log(result);
//     // >> 'bar'
//     redisCache.del('foo', err => {});
//   });
// });

// function getUser(id, cb) {
//   setTimeout(() => {
//     console.log('Returning user from slow database.');
//     cb(null, { id: id, name: 'Bob' });
//   }, 100);
// }

// var userId = 123;
// var key = `user_${userId}`;

// // Note: ttl is optional in wrap()
// redisCache.wrap(
//   key,
//   cb => {
//     getUser(userId, cb);
//   },
//   { ttl: ttl },
//   (err, user) => {
//     console.log(user);

//     // Second time fetches user from redisCache
//     redisCache
//       .wrap(key, () => getUser(userId))
//       .then(console.log)
//       .catch(err => {
//         // handle error
//       });
//   },
// );
