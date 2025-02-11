import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkWorkSpace, createWorkspace, workspace, getWorkSpace, updateWorkspace, deleteWorkspace } from "../controllers/workSpaceController"


const router = express.Router();

router.get('/check-workspace/:id', authenticateToken, checkWorkSpace);
router.post("/workspaces", authenticateToken, createWorkspace) // create a new workspace
router.get("/workspaces", authenticateToken, workspace) // get all workspaces
router.put("/workspaces/:id", authenticateToken, updateWorkspace) // update workspace
router.get("/workspaces/:id", authenticateToken, getWorkSpace) // get workspace by Id
router.delete("/workspaces/:id", authenticateToken, deleteWorkspace) // delete workspace by Id

export default router;