import express, {Request, Response} from 'express';

const router = express.Router();

// GET /api/users
router.get('/', (req, res: Response) => {
  res.json({ message: 'Welcome to the Users API!' });
});

// GET /api/users/:id
router.get('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  res.json({ message: `Fetching user with ID: ${userId}` });
});

// POST /api/users
router.post('/', (req, res: Response) => {
  res.json({ message: 'User created successfully!' });
});

// PUT /api/users/:id
router.put('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  res.json({ message: `User with ID: ${userId} updated successfully!` });
});

// DELETE /api/users/:id
router.delete('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  res.json({ message: `User with ID: ${userId} deleted successfully!` });
});

export default router;