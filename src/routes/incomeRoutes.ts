import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createIncome, deleteIncome } from '../controllers/incomeController';


const router = express.Router();

router.post('/incomes', authenticateToken, createIncome);
router.delete("/incomes/:id", authenticateToken, deleteIncome)

export default router;