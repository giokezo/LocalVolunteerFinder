"use strict";
// backend/src/routes/users.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const users_1 = require("../data/users");
const authMiddleware_1 = require("../middleware/authMiddleware");
const opportunities_1 = require("../data/opportunities");
const router = express_1.default.Router();
// Test route to ensure the file is loaded
router.get('/test', (req, res) => {
    res.send('User route is working!');
});
/**
 * @route POST /api/users/register
 */
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required.' });
            return;
        }
        const users = (0, users_1.getUsers)();
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            res.status(400).json({ error: 'User already exists.' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = {
            id: (0, uuid_1.v4)(),
            name,
            email,
            password: hashedPassword,
            savedOpportunities: []
        };
        users.push(newUser);
        (0, users_1.saveUsers)(users);
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        res.status(201).json({
            message: 'Registration successful.',
            user: userWithoutPassword
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
}));
/**
 * @route GET /api/users/me
 */
router.get('/me', authMiddleware_1.authenticate, (req, res) => {
    const users = (0, users_1.getUsers)();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    res.json(userWithoutPassword);
});
// ======================= USER-SPECIFIC OPPORTUNITY ROUTES =======================
/**
 * @route GET /api/users/me/saved-opportunities
 */
router.get('/me/saved-opportunities', authMiddleware_1.authenticate, (req, res) => {
    const users = (0, users_1.getUsers)();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const savedOps = opportunities_1.opportunities.filter(op => user.savedOpportunities.includes(op.id));
    res.json(savedOps);
});
/**
 * @route GET /api/users/me/signed-up-opportunities
 */
router.get('/me/signed-up-opportunities', authMiddleware_1.authenticate, (req, res) => {
    const users = (0, users_1.getUsers)();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const signedUpOps = opportunities_1.opportunities.filter(op => op.attendees.includes(user.id));
    res.json(signedUpOps);
});
/**
 * @route POST /api/users/me/saved-opportunities
 */
router.post('/me/saved-opportunities', authMiddleware_1.authenticate, (req, res) => {
    const { opportunityId } = req.body;
    if (!opportunityId) {
        res.status(400).json({ error: 'Opportunity ID is required' });
        return;
    }
    const users = (0, users_1.getUsers)();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    if (!user.savedOpportunities.includes(opportunityId)) {
        user.savedOpportunities.push(opportunityId);
        (0, users_1.saveUsers)(users);
    }
    res.status(200).json({ message: 'Opportunity saved successfully' });
});
/**
 * @route DELETE /api/users/me/saved-opportunities/:id
 */
router.delete('/me/saved-opportunities/:id', authMiddleware_1.authenticate, (req, res) => {
    const { id: opportunityId } = req.params;
    const users = (0, users_1.getUsers)();
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const initialLength = user.savedOpportunities.length;
    user.savedOpportunities = user.savedOpportunities.filter(id => id !== opportunityId);
    if (user.savedOpportunities.length < initialLength) {
        (0, users_1.saveUsers)(users);
    }
    res.status(200).json({ message: 'Opportunity unsaved successfully' });
});
// ======================================================================================
exports.default = router;
