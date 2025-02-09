import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createExpense, deleteExpense } from '../controllers/expenseController';


const router = express.Router();

router.post('/create-expense', authenticateToken, createExpense);
router.delete("/delete-expense/:id", authenticateToken, deleteExpense)

export default router;