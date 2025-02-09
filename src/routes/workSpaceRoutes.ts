import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkWorkSpace, createWorkspace, workspace, getWorkSpace, updateWorkspace } from "../controllers/workSpaceController"


const router = express.Router();

router.get('/check-workspace/:id', authenticateToken, checkWorkSpace);
router.post("/create-workspace", authenticateToken, createWorkspace)
router.get("/workspace", authenticateToken, workspace)
router.put("/update-workspace/:id", authenticateToken, updateWorkspace)
router.get("/get-workspace/:id", authenticateToken, getWorkSpace)

export default router;