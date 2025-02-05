import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { register, login, logout, refreshToken } from '../controllers/authController';

const   router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post("/refresh-token", refreshToken)
router.post('/logout', logout);
export default router;