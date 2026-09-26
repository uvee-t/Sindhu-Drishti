import { Queue } from 'bullmq';
import { bullRedis } from '../config/redis.js';

const alertQueue = new Queue('volunteer-alerts', {
    connection: bullRedis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
    },
});

export { alertQueue };
