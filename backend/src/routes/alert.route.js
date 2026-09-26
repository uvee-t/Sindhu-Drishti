import express from 'express';

import {
    registerVolunteer,
    getAlertVolunteers,
    sendAlert,
} from '../controllers/volunteer.controller.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { authCheck } from '../middleware/auth-check.middleware.js';

const router = express.Router();

router.post('/volunteer', asyncHandler(registerVolunteer));
router.get('/volunteer', authCheck, asyncHandler(getAlertVolunteers));
router.post('/send', authCheck, asyncHandler(sendAlert));

export default router;
