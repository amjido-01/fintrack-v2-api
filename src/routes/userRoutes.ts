import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  profile
  // updateUser,
  // deleteUser
} from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();


// User routes
router.get('/', getUsers);
// router.get('/:id', getUserById);
router.post('/', createUser);
router.get("/profile", authenticateToken, profile)
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;