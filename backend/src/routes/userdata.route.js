import express from 'express';
import { authCheck } from '../middleware/auth-check.middleware.js';
import { userDataController } from '../controllers/userdata.controller.js';
const router = express.Router();

router.get('/', authCheck, userDataController);

export default router;
