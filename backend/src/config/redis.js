import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const redisConfig = {
    username: env.REDIS_USERNAME,
    host: env.REDIS_HOST,
    password: env.REDIS_PASSWORD,
    port: env.REDIS_PORT,
    enableReadyCheck: true,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
};

const redisClient = new Redis({
    ...redisConfig,
    maxRetriesPerRequest: env.REDIS_MAX_RETRIES,
    connectionName: 'redis-connection',
});

const bullRedis = new Redis({
    ...redisConfig,
    maxRetriesPerRequest: null,
    connectionName: 'bull-connection',
});

[redisClient, bullRedis].forEach((client) => {
    client.on('connect', () => {
        logger.info(`${client.options.connectionName} connected.`);
    });
    client.on('error', (err) => {
        logger.error(`${client.options.connectionName} connection failed, Error: ${err}.`);
    });
});

export { redisClient, bullRedis };
