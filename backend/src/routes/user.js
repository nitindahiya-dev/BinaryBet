// backend/src/routes/user.js
import express from 'express';
import { getUser, getUserActivities, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Existing routes
router.get('/:wallet', getUser);
router.get('/:wallet/activities', getUserActivities);

// New route for deleting a user
router.delete('/:wallet', deleteUser);

export default router;
