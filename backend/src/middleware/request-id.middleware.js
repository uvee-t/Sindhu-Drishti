import { randomUUID } from 'node:crypto';

const requestId = (req, res, next) => {
    const id = randomUUID();
    req.id = id;
    res.setHeader('X-Request-ID', id);
    next();
};

export { requestId };
