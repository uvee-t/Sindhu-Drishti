import pino from 'pino';
import { env } from '../config/env.js';

const logger = pino({
    level: env.LOG_LEVEL,
    base: {
        service: 'sindhu-drishti-backend',
        environment: env.NODE_ENV,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'password',
            'token',
            'accessToken',
            'refreshToken',
            'email',
        ],
        censor: '[REDACTED]',
    },
});

export { logger };
