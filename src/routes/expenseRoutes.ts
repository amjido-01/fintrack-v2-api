import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createExpense } from '../controllers/expenseController';


const router = express.Router();

router.post('/create-expense', authenticateToken, createExpense);

export default router;