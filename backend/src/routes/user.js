import express from 'express';
import { getUserActivities, getUser } from '../controllers/userController.js';

const router = express.Router();

// Recent activity (paged)
router.get('/:wallet/activities', getUserActivities);

// User + stats
router.get('/:wallet', getUser);

export default router;
