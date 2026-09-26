import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().max(65535).default(4000),

    DATABASE_URL: z.url(),
    MONGO_DB_URL: z.url(),
    MONGO_DB_NAME: z.string().min(1),

    DB_POOL_MIN: z.coerce.number().int().nonnegative().default(2),
    DB_POOL_MAX: z.coerce.number().int().positive().default(10),
    DB_IDLE_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
    DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(5_000),

    REDIS_USERNAME: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_PORT: z.coerce.number().int().positive(),
    REDIS_MAX_RETRIES: z.coerce.number().int().nonnegative(),

    API_BASE_URL: z.url().default('http://localhost:3000'),

    SECRET_KEY: z.string().min(32, 'SECRET_KEY must be at least 32 characters long'),

    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_SECURE: z
        .enum(['true', 'false'])
        .default('true')
        .transform((value) => value === 'true'),
    SMTP_USER: z.email(),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM: z.string().min(1),

    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

const res = envSchema.safeParse(process.env);

if (!res.success) {
    throw new Error(`Invalid environment configuration: ${z.prettifyError(res.error)}`);
}

const env = Object.freeze(res.data);

export { env };
