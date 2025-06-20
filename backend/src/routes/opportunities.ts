import express from 'express';
import { opportunities } from '../data/opportunities';

const router = express.Router();

// GET /api/opportunities with keyword and type filtering
router.get('/', (req, res) => {
  let results = [...opportunities]; 

  const keyword = (req.query.keyword as string)?.toLowerCase();
  const type = (req.query.type as string)?.toLowerCase();

  // Filter by keyword in title or description
  if (keyword) {
    results = results.filter(opp =>
      opp.title.toLowerCase().includes(keyword) ||
      opp.description.toLowerCase().includes(keyword)
    );
  }

  // Filter by opportunity type
  if (type) {
    results = results.filter(opp =>
      opp.type.toLowerCase() === type
    );
  }

  res.json(results);
});

// GET /api/opportunities/:id for single opportunity
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
