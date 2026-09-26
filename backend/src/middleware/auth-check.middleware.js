import { District } from '../models/district.model.js';
import { AppError } from '../utils/errors.js';
import { verifyJWT } from '../utils/jwt.js';

const authCheck = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return next(new AppError('Authentication required.', 401, 'AUTHENTICATION_REQUIRED'));
    }

    const decoded = verifyJWT(token);

    const distData = await District.findOne({ distCode: decoded.distCode }).lean();

    if (!distData) {
        return next(new AppError('District information not found.', 403, 'DISTRICT_NOT_FOUND'));
    }

    req.user = {
        ...decoded,
        distName: distData.distName,
    };

    next();
};

export { authCheck };
