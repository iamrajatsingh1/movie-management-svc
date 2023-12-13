const redis = require('redis');
const util = require('util');
const cacheManager = require('cache-manager');

// Create a Redis client
const redisUri = process.env.REDIS_URI || 'redis://localhost:6379';
const redisClient = redis.createClient(redisUri);
const getAsync = util.promisify(redisClient.get).bind(redisClient);

// Create a cache manager with Redis as the store
const cache = cacheManager.caching({
    store: 'memory', // Use 'memory' for local caching
    max: 100,        // Maximum number of items in the cache
    ttl: 60 * 60 * 24 // Time-to-live in seconds (1 day)
});

module.exports = { redisClient, cache, getAsync };
