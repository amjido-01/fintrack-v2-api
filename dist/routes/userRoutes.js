"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// GET /api/users
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Users API!' });
});
// GET /api/users/:id
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Fetching user with ID: ${userId}` });
});
// POST /api/users
router.post('/', (req, res) => {
    res.json({ message: 'User created successfully!' });
});
// PUT /api/users/:id
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User with ID: ${userId} updated successfully!` });
});
// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User with ID: ${userId} deleted successfully!` });
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map