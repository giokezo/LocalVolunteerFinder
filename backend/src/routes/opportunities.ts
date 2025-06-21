import express from 'express';
import { findOpportunities, findOpportunityById } from '../services/opportunityService';

const router = express.Router();

router.get('/', (req, res) => {
  const { keyword, type } = req.query;
  const opportunities = findOpportunities({
    keyword: keyword as string,
    type: type as string
  });

  res.json(opportunities);
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

export default router;
