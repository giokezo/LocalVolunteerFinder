// backend/src/routes/opportunities.ts

import express from 'express';
import { findOpportunities, findOpportunityById } from '../services/opportunityService';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', (req, res) => {
  const { keyword, type, page, limit } = req.query;

  const results = findOpportunities({
    keyword: keyword as string,
    type: type as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
  });
console.log(results)
  res.json(results);
});


router.get('/:id', (req, res) => {
  const { id } = req.params;
  const opportunity = findOpportunityById(id);

  if (opportunity) {
    res.json(opportunity);
  } else {
    res.status(404).json({ error: 'Opportunity not found' });
  }
});

router.post('/:id/signup', authenticate, (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const opportunity = findOpportunityById(id);

  if (!opportunity) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }

  if (userId && !opportunity.attendees.includes(userId)) {
    opportunity.attendees.push(userId);
  }

  res.status(200).json({ message: 'Successfully signed up!' });
});

export default router;