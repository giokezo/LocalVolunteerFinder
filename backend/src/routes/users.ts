import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../data/users';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @route GET /api/users
 * @description Get a list of all users.
 * @returns {User[]} An array of users.
 */
router.get('/', (req, res) => {
  res.json(users);
});

/**
 * @route POST /api/users/register
 * @description Register a new user
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

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
      savedOpportunities: []
    };

    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * @route POST /api/users/me/saved-opportunities
 * @desc Save an opportunity for the logged-in user
 */
router.post('/me/saved-opportunities', authenticate, (req: AuthRequest, res) => {
  const userId = req.user.id;
  const { opportunityId } = req.body;

  if (!opportunityId) {
    res.status(400).json({ error: 'Opportunity ID is required' });
    return;
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (!user.savedOpportunities.includes(opportunityId)) {
    user.savedOpportunities.push(opportunityId);
  }

  res.json({ message: 'Opportunity saved', savedOpportunities: user.savedOpportunities });
});

/**
 * @route DELETE /api/users/me/saved-opportunities/:opportunityId
 * @desc Unsave an opportunity for the logged-in user
 */
router.delete('/me/saved-opportunities/:opportunityId', authenticate, (req: AuthRequest, res) => {
  const userId = req.user.id;
  const { opportunityId } = req.params;

  const user = users.find(u => u.id === userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.savedOpportunities = user.savedOpportunities.filter(id => id !== opportunityId);

  res.json({ message: 'Opportunity removed from saved', savedOpportunities: user.savedOpportunities });
});

export default router;
