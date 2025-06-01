import express from 'express';
import { opportunities } from '../data/opportunities';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(opportunities);
});

export default router;
