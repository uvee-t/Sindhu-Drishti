import pg from 'pg';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
const { Pool } = pg;

const postgresPool = new Pool({
    connectionString: env.DATABASE_URL,
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS,
    keepAlive: true,
});

postgresPool.on('error', (err) => {
    logger.error({ err }, 'PostgreSQL Pool Error:');
});

const checkPostgreSQLConnection = async () => {
    await postgresPool.query('SELECT 1');
    logger.info({ database: 'postgresql' }, 'PostgreSQL connection established');
};

export { postgresPool, checkPostgreSQLConnection };
