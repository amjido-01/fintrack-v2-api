import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createExpense, deleteExpense, editExpense } from '../controllers/expenseController';


const router = express.Router();

router.post('/expenses', authenticateToken, createExpense);
router.delete("/expenses/:id", authenticateToken, deleteExpense);
router.put("/expenses/:id", authenticateToken, editExpense)

export default router;