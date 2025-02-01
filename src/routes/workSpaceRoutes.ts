import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkWorkSpace, createWorkspace } from "../controllers/workSpaceController"


const router = express.Router();

router.post('/check-workspace/:id', authenticateToken, checkWorkSpace);
router.post("/create-workspace", authenticateToken, createWorkspace)

export default router;