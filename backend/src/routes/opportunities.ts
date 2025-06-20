import express from 'express';
import { opportunities } from '../data/opportunities';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(opportunities);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const opportunity = opportunities.find(opp => opp.id === id);

  if (opportunity) {
    res.json(opportunity);
  } else {
    res.status(404).json({ error: 'Opportunity not found' });
  }
});

export default router;
