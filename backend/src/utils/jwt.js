import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AppError } from './errors.js';

const genJWT = (fullname, distCode, email) => {
    try {
        return jwt.sign(
            {
                fullname,
                distCode,
                email,
            },
            env.SECRET_KEY,
            {
                expiresIn: '1h',
            },
        );
    } catch (error) {
        throw new AppError(
            'Failed to generate authentication token.',
            500,
            'JWT_GENERATION_FAILED',
            false,
        );
    }
};

const verifyJWT = (token) => {
    try {
        return jwt.verify(token, env.SECRET_KEY);
    } catch (error) {
        throw new AppError('Invalid or expired authentication token.', 401, 'INVALID_TOKEN');
    }
};

export { genJWT, verifyJWT };
