import express from 'express';

import {
    getRedZones,
    checkLocation,
    nearestGreenZone,
    priorityVillages,
    locations,
    relocationSites,
    nearestSafeZone,
    floodZones,
} from '../controllers/zone.controller.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { authCheck } from '../middleware/auth-check.middleware.js';

const router = express.Router();
router.get('/redzones', authCheck, asyncHandler(getRedZones));
router.get('/check-location', authCheck, asyncHandler(checkLocation));
router.get('/nearest-green-zone', authCheck, asyncHandler(nearestGreenZone));
router.get('/priority-villages', authCheck, asyncHandler(priorityVillages));
router.get('/locations', authCheck, asyncHandler(locations));
router.get('/relocation-sites', authCheck, asyncHandler(relocationSites));
router.get('/nearest-safe-zone', authCheck, asyncHandler(nearestSafeZone));
router.get('/flood-zones', authCheck, asyncHandler(floodZones));

export default router;
