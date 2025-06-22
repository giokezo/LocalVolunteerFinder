import express from 'express';
import cors from 'cors';
import opportunitiesRoute from './routes/opportunities';
import 'dotenv/config';
import usersRoute from './routes/users';
import authRoute from './routes/auth';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Volunteer API is running!');
});

app.use('/api/opportunities', opportunitiesRoute);

app.use('/api/users', usersRoute);

app.use('/api/auth', authRoute);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;