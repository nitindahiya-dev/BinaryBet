// backend/src/routes/matches.js
import express from "express";
const router = express.Router();
import { getMatches } from '../controllers/matchController.js';

router.get('/', getMatches);
export default router; // Changed to ES module export