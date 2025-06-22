"use strict";
// backend/src/routes/opportunities.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const opportunityService_1 = require("../services/opportunityService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    const { keyword, type, page, limit } = req.query;
    const results = (0, opportunityService_1.findOpportunities)({
        keyword: keyword,
        type: type,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 10,
    });
    console.log(results);
    res.json(results);
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const opportunity = (0, opportunityService_1.findOpportunityById)(id);
    if (opportunity) {
        res.json(opportunity);
    }
    else {
        res.status(404).json({ error: 'Opportunity not found' });
    }
});
router.post('/:id/signup', authMiddleware_1.authenticate, (req, res) => {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const opportunity = (0, opportunityService_1.findOpportunityById)(id);
    if (!opportunity) {
        res.status(404).json({ error: 'Opportunity not found' });
        return;
    }
    if (userId && !opportunity.attendees.includes(userId)) {
        opportunity.attendees.push(userId);
    }
    res.status(200).json({ message: 'Successfully signed up!' });
});
exports.default = router;
