// backend/src/routes/users.ts

import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, saveUsers } from '../data/users';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { opportunities } from '../data/opportunities';

const router = express.Router();

// Test route to ensure the file is loaded
router.get('/test', (req: Request, res: Response) => {
  res.send('User route is working!');
});

/**
 * @route POST /api/users/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    const users = getUsers();
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   const newUser: User = {
  id: uuidv4(),
  name,
  email,
  password: hashedPassword,
  savedOpportunities: [],
  role: 'volunteer'
};

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Registration successful.',
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * @route GET /api/users/me
 */
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});


// ======================= USER-SPECIFIC OPPORTUNITY ROUTES =======================

/**
 * @route GET /api/users/me/saved-opportunities
 */
router.get('/me/saved-opportunities', authenticate, (req: AuthRequest, res: Response) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const savedOps = opportunities.filter(op =>
    user.savedOpportunities.includes(op.id)
  );

  res.json(savedOps);
});

/**
 * @route GET /api/users/me/signed-up-opportunities
 */
router.get('/me/signed-up-opportunities', authenticate, (req: AuthRequest, res: Response) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    const signedUpOps = opportunities.filter(op =>
        op.attendees.includes(user.id)
    );

    res.json(signedUpOps);
});

/**
 * @route POST /api/users/me/saved-opportunities
 */
router.post('/me/saved-opportunities', authenticate, (req: AuthRequest, res: Response) => {
  const { opportunityId } = req.body;
  if (!opportunityId) {
    res.status(400).json({ error: 'Opportunity ID is required' });
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (!user.savedOpportunities.includes(opportunityId)) {
    user.savedOpportunities.push(opportunityId);
    saveUsers(users);
  }

  res.status(200).json({ message: 'Opportunity saved successfully' });
});

/**
 * @route DELETE /api/users/me/saved-opportunities/:id
 */
router.delete('/me/saved-opportunities/:id', authenticate, (req: AuthRequest, res: Response) => {
  const { id: opportunityId } = req.params;

  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const initialLength = user.savedOpportunities.length;
  user.savedOpportunities = user.savedOpportunities.filter(id => id !== opportunityId);

  if (user.savedOpportunities.length < initialLength) {
    saveUsers(users);
  }

  res.status(200).json({ message: 'Opportunity unsaved successfully' });
});

// ======================================================================================

export default router;