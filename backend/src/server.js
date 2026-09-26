import { env } from './config/env.js';
import { app } from './app.js';
import { checkPostgreSQLConnection, postgresPool } from './config/database.js';
import { connectMongoDB } from './config/mongo.js';
import { redisClient, bullRedis } from './config/redis.js';
import { logger } from './utils/logger.js';
import mongoose from 'mongoose';

const startServer = async () => {
    try {
        await checkPostgreSQLConnection();
        await connectMongoDB();
        await redisClient.ping();
        await bullRedis.ping();
        const server = app.listen(env.PORT, () => {
            logger.info(
                {
                    port: env.PORT,
                    environment: env.NODE_ENV,
                },
                'Backend Server started',
            );
            const shutdown = (signal) => {
                logger.info(
                    {
                        signal,
                    },
                    'Shutdown signal received',
                );
                server.close(async () => {
                    try {
                        await postgresPool.end();
                        await mongoose.connection.close();
                        await redisClient.quit();
                        await bullRedis.quit();
                        logger.info('Application shut down gracefully');
                    } catch (error) {
                        logger.error({ error }, 'Error during shutdown');
                        process.exit(1);
                    }
                });
            };
            process.on('SIGTERM', shutdown);
            process.on('SIGINT', shutdown);
        });
    } catch (error) {
        logger.fatal({ error }, 'Failed to start application');
        process.exit(1);
    }
};
startServer();
