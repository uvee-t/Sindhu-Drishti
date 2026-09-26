import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
mongoose.set('strictQuery', true);
let db = null;
const connectMongoDB = async () => {
    if (db) return db;
    db = await mongoose.connect(env.MONGO_DB_URL, {
        dbName: env.MONGO_DB_NAME,
        maxPoolSize: Number(env.DB_POOL_MAX),
        minPoolSize: Number(env.DB_POOL_MIN),
        serverSelectionTimeoutMS: Number(env.DB_IDLE_TIMEOUT_MS),
        socketTimeoutMS: Number(env.DB_CONNECTION_TIMEOUT_MS),
        retryWrites: true,
        w: 'majority',
    });

    return db;
};
mongoose.connection.on('error', (err) => {
    logger.error({ err }, 'MongoDB Connection Error:');
});
mongoose.connection.on('connected', () => {
    logger.info({ database: 'mongodb' }, 'MongoDB connection established');
});
export { connectMongoDB };
