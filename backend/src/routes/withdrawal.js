// backend/src/routes/withdrawal.js
import express from "express";
const router = express.Router();
import { createWithdrawal } from "../controllers/withdrawalController.js";

router.post('/', createWithdrawal);
export default router;