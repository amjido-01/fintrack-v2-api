"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// POST /api/auth/login
router.post('/login', (req, res) => {
    res.json({ message: 'Logged in successfully!' });
});
// POST /api/auth/register
router.post('/register', (req, res) => {
    res.json({ message: 'User registered successfully!' });
});
// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully!' });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map