import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createIncome, deleteIncome, editIncome } from '../controllers/incomeController';


const router = express.Router();

router.post('/incomes', authenticateToken, createIncome);
router.delete("/incomes/:id", authenticateToken, deleteIncome)
router.put("/edit-income/:id", authenticateToken, editIncome)

export default router;