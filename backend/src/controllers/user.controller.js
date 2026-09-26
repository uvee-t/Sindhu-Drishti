import { User } from '../models/user.model.js';

import { registerValidateSchema, loginValidateSchema } from '../validators/user.validator.js';

import { hashPass, verifyPass } from '../utils/password.js';

import { genJWT } from '../utils/jwt.js';

import { AppError } from '../utils/errors.js';

const registerUser = async (req, res) => {
    const result = registerValidateSchema.safeParse(req.body);

    if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400, 'VALIDATION_ERROR');
    }

    const { fullname, email, distCode, password } = result.data;

    const isEmailExists = await User.findOne({
        email,
    });

    if (isEmailExists) {
        throw new AppError('Email already exists!', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const insertData = await User.insertOne({
        fullname,
        email,
        distCode,
        password: await hashPass(password),
    });

    if (!insertData) {
        throw new AppError('Data insertion failed!', 400, 'DATA_INSERTION_FAILED');
    }

    return res.status(200).json({
        success: true,
        message: {
            fullname,
            distCode,
            email,
        },
    });
};

const loginUser = async (req, res) => {
    const result = loginValidateSchema.safeParse(req.body);

    if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400, 'VALIDATION_ERROR');
    }

    const { distCode, email, password } = result.data;

    const user = await User.findOne({
        email,
    });

    if (!user) {
        throw new AppError('Invalid Credentials!', 401, 'INVALID_CREDENTIALS');
    }

    if (distCode !== user.distCode) {
        throw new AppError('Invalid Credentials!', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await verifyPass(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid Credentials!', 401, 'INVALID_CREDENTIALS');
    }

    const token = genJWT(user.fullname, distCode, email);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: 'Login Successfull!',
    });
};

const logoutUser = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
    });
};

export { registerUser, loginUser, logoutUser };
