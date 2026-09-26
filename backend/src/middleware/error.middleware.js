import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const notFound = (req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
};

const errorHandler = (err, req, res, next) => {
    const isOperational = err.isOperational === true;

    const statusCode =
        Number.isInteger(err.statusCode) &&
        err.statusCode >= 400 &&
        err.statusCode <= 599 &&
        isOperational
            ? err.statusCode
            : 500;

    const code =
        typeof err.code === 'string' && err.code.length > 0 && isOperational
            ? err.code
            : 'INTERNAL_SERVER_ERROR';

    const message = isOperational ? err.message : 'An unexpected error occurred';

    const logContext = {
        requestId: req.id,
        method: req.method,
        path: req.originalUrl,
        statusCode,
        errorCode: code,
    };

    if (!isOperational) {
        logger.error(
            {
                ...logContext,
                err,
            },
            'Unhandled request error',
        );
    } else {
        logger.warn(
            {
                ...logContext,
                err,
            },
            'Request failed',
        );
    }

    return res.status(statusCode).json({
        error: {
            code,
            message,
            requestId: req.id,
        },
    });
};

export { notFound, errorHandler };
