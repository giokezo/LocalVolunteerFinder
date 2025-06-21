import express from 'express';
import { findOpportunities, findOpportunityById } from '../services/opportunityService';

const router = express.Router();

/**
 * @route GET /api/opportunities
 * @description Get a list of all volunteer opportunities, with optional filtering.
 * @param {string} [keyword] - A search term to filter by title and description.
 * @param {string} [type] - The type of opportunity to filter by (e.g., "education").
 * @returns {VolunteerOpportunity[]} An array of volunteer opportunities.
 */
router.get('/', (req, res) => {
  const { keyword, type } = req.query;

  const opportunities = findOpportunities({
    keyword: keyword as string,
    type: type as string
  });

  res.json(opportunities);
});

/**
 * @route GET /api/opportunities/:id
 * @description Get a specific volunteer opportunity by its ID.
 * @param {string} id - The unique ID of the opportunity.
 * @returns {VolunteerOpportunity | 404} A single opportunity object or an error if not found.
 */
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
