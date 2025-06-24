import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, saveUsers } from '../data/users'; 
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { opportunities } from '../data/opportunities';

const router = express.Router();

// ... (existing /register and /me routes are fine and do not need changes)
router.get('/test', (req: Request, res: Response) => {
  res.send('User route is working!');
});

router.post('/register', async (req: Request, res: Response): Promise<void> => {
    // ... code for registration
});

router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
    // ... code for getting user profile
});


// ======================= SAVED OPPORTUNITIES ROUTES (CORRECTED) =======================

/**
 * @route GET /api/users/me/saved-opportunities
 * @desc Get all saved opportunities for the logged-in user
 */
router.get('/me/saved-opportunities', authenticate, (req: AuthRequest, res: Response) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return; // <-- FIX: Plain return to stop execution
  }

  const savedOps = opportunities.filter(op => 
    user.savedOpportunities.includes(op.id)
  );

  res.json(savedOps);
});

/**
 * @route POST /api/users/me/saved-opportunities
 * @desc Save an opportunity for the logged-in user
 */
router.post('/me/saved-opportunities', authenticate, (req: AuthRequest, res: Response) => {
  const { opportunityId } = req.body;
  if (!opportunityId) {
    res.status(400).json({ error: 'Opportunity ID is required' });
    return; // <-- FIX: Plain return
  }
  
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return; // <-- FIX: Plain return
  }

  if (!user.savedOpportunities.includes(opportunityId)) {
    user.savedOpportunities.push(opportunityId);
    saveUsers(users);
  }

  res.status(200).json({ message: 'Opportunity saved successfully' });
});

/**
 * @route DELETE /api/users/me/saved-opportunities/:id
 * @desc Unsave an opportunity for the logged-in user
 */
router.delete('/me/saved-opportunities/:id', authenticate, (req: AuthRequest, res: Response) => {
  const { id: opportunityId } = req.params;
  
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return; // <-- FIX: Plain return
  }

  const initialLength = user.savedOpportunities.length;
  user.savedOpportunities = user.savedOpportunities.filter(id => id !== opportunityId);

  if (user.savedOpportunities.length < initialLength) {
    saveUsers(users);
  }

  res.status(200).json({ message: 'Opportunity unsaved successfully' });
});

/**
 * @route GET /api/users/me/signed-up-opportunities
 * @desc Get all opportunities the logged-in user has signed up for
 */
router.get('/me/signed-up-opportunities', authenticate, (req: AuthRequest, res: Response) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Filter the main opportunities list to find ones where the user's ID is in the attendees array
  const signedUpOps = opportunities.filter(op => 
    op.attendees.includes(user.id)
  );

  res.json(signedUpOps);
});

// ======================================================================================

export default router;