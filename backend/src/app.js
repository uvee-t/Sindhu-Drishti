import pinoHttp from 'pino-http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { logger } from './utils/logger.js';
import { requestId } from './middleware/request-id.middleware.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

import userRouter from './routes/user.route.js';
import zoneRouter from './routes/zone.route.js';
import userDataRouter from './routes/userdata.route.js';
import alertRouter from './routes/alert.route.js';

const app = express();

app.disable('x-powered-by');

app.use(
    helmet({
        strictTransportSecurity: process.env.NODE_ENV === 'production',
    }),
);

app.use(
    cors({
        origin: (origin, callback) => callback(null, true),
        credentials: true,
    }),
);

app.use(requestId);

app.use(
    pinoHttp({
        logger,
        genReqId: (req) => req.id,
    }),
);

app.use(express.json({ limit: '4kb' }));
app.use(express.urlencoded({ extended: true, limit: '4kb' }));
app.use(cookieParser());

app.use('/auth', userRouter);
app.use('/api/zone', zoneRouter);
app.use('/api/user', userDataRouter);
app.use('/api/alert', alertRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
