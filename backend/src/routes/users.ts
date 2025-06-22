import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getUsers, saveUsers } from '../data/users'; 
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// ======================= THIS IS THE NEW TEST ROUTE =======================
// It helps us check if this file is being loaded correctly by server.ts.
router.get('/test', (req: Request, res: Response) => {
  res.send('User route is working!');
});
// ==========================================================================

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
      savedOpportunities: []
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

export default router;