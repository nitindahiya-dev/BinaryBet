import express from 'express';
const router = express.Router();
import { upsertUser } from '../controllers/authController.js';

router.post('/', upsertUser);

export default router;