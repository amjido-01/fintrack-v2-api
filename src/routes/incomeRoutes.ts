import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createIncome } from '../controllers/incomeController';


const router = express.Router();

router.post('/create-income', authenticateToken, createIncome);

export default router;