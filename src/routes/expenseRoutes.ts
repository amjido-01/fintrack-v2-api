import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createExpense, deleteExpense, editExpense } from '../controllers/expenseController';


const router = express.Router();

router.post('/create-expense', authenticateToken, createExpense);
router.delete("/delete-expense/:id", authenticateToken, deleteExpense);
router.put("/edit-expense/:id", authenticateToken, editExpense)

export default router;