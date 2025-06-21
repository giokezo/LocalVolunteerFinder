import express from 'express';
import { users } from '../data/users';

const router = express.Router();

/**
 * @route GET /api/users
 * @description Get a list of all users.
 * @returns {User[]} An array of users.
 */
router.get('/', (req, res) => {
  res.json(users);
});

export default router;
