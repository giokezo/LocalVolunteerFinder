import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { findOpportunities, findOpportunityById } from '../services/opportunityService';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { opportunities } from '../data/opportunities'; // Direct access for mutation
import { VolunteerOpportunity } from '../models/VolunteerOpportunity';

const router = express.Router();

// --- GET (Read) ROUTES ---

/**
 * @route GET /api/opportunities
 * @desc Get all opportunities with filtering and pagination
 * @access Public
 */
router.get('/', (req, res) => {
  // Destructure all possible query parameters, including the new location-based ones.
  const { keyword, type, page, limit, zipcode, radius, latitude, longitude } = req.query;

  // Pass all parameters to the service function for processing.
  const results = findOpportunities({
    keyword: keyword as string,
    type: type as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 10,
    zipcode: zipcode as string,
    radius: radius ? parseFloat(radius as string) : undefined,
    latitude: latitude ? parseFloat(latitude as string) : undefined,
    longitude: longitude ? parseFloat(longitude as string) : undefined,
  });
  
  res.json(results);
});


/**
 * @route GET /api/opportunities/:id
 * @desc Get a single opportunity by its ID
 * @access Public
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


// --- POST (Create) ROUTE ---

/**
 * @route POST /api/opportunities
 * @desc Create a new volunteer opportunity
 * @access Private (Organizer only)
 */
router.post('/', authenticate, (req: AuthRequest, res) => {
  // 1. Authorization: Check if user is an organizer
  if (req.user.role !== 'organizer') {
    res.status(403).json({ error: 'Forbidden: Only organizers can create opportunities.' });
    return;
  }

  // 2. Validation: Check for required fields
  const { title, description, date, location, type, latitude, longitude } = req.body;
  if (!title || !description || !date || !location || !type || latitude === undefined || longitude === undefined) {
    res.status(400).json({ error: 'Please provide all required fields, including latitude and longitude.' });
    return;
  }

  // 3. Creation
  const newOpportunity: VolunteerOpportunity = {
    id: uuidv4(),
    title,
    description,
    date,
    location,
    type,
    latitude,
    longitude,
    attendees: [],
    organizerId: req.user.id, // Assign ownership
  };

  opportunities.unshift(newOpportunity); // Add to the start of the list for immediate visibility

  res.status(201).json(newOpportunity);
});


// --- PUT (Update) ROUTE ---

/**
 * @route PUT /api/opportunities/:id
 * @desc Update an existing volunteer opportunity
 * @access Private (Organizer who owns the opportunity)
 */
router.put('/:id', authenticate, (req: AuthRequest, res) => {
  const { id } = req.params;
  const opportunity = findOpportunityById(id);

  if (!opportunity) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }

  // Authorization: Check if user is an organizer AND owns the opportunity
  if (req.user.role !== 'organizer' || opportunity.organizerId !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You do not have permission to edit this opportunity.' });
    return;
  }

  // Update the opportunity with new data from the request body
  Object.assign(opportunity, req.body);
  
  res.status(200).json(opportunity);
});


// --- DELETE ROUTE ---

/**
 * @route DELETE /api/opportunities/:id
 * @desc Delete a volunteer opportunity
 * @access Private (Organizer who owns the opportunity)
 */
router.delete('/:id', authenticate, (req: AuthRequest, res) => {
  const { id } = req.params;
  const opportunityIndex = opportunities.findIndex(op => op.id === id);

  if (opportunityIndex === -1) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }

  const opportunity = opportunities[opportunityIndex];

  // Authorization: Check if user is an organizer AND owns the opportunity
  if (req.user.role !== 'organizer' || opportunity.organizerId !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You do not have permission to delete this opportunity.' });
    return;
  }
  
  // Remove the opportunity from the array
  opportunities.splice(opportunityIndex, 1);
  
  res.status(200).json({ message: 'Opportunity deleted successfully' });
});


// --- USER ACTION ROUTE ---

/**
 * @route POST /api/opportunities/:id/signup
 * @desc Allow a user to sign up for an opportunity
 * @access Private (Any logged-in user)
 */
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

/**
 * @route DELETE /api/opportunities/:id/signup
 * @desc Allow a user to un-register from an opportunity
 * @access Private (Any logged-in user)
 */
router.delete('/:id/signup', authenticate, (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const opportunity = findOpportunityById(id);

  if (!opportunity) {
    res.status(404).json({ error: 'Opportunity not found' });
    return;
  }

  // Filter the user's ID out of the attendees array
  const initialLength = opportunity.attendees.length;
  opportunity.attendees = opportunity.attendees.filter(attendeeId => attendeeId !== userId);

  // You could save the data back to a file here if you were persisting it
  
  res.status(200).json({ message: 'Successfully unregistered!' });
});

export default router;