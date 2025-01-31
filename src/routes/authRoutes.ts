import express, {Request, Response} from 'express';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res: Response) => {
  res.json({ message: 'Logged in successfully!' });
});

// POST /api/auth/register
router.post('/register', (req, res: Response) => {
  res.json({ message: 'User registered successfully!' });
});

// POST /api/auth/logout
router.post('/logout', (req, res: Response) => {
  res.json({ message: 'Logged out successfully!' });
});

export default router;