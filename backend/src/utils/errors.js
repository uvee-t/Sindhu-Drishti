class AppError extends Error {
    constructor(message, statusCode, code, isOperational = true) {
        super(message);

        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError };
