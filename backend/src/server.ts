import express from 'express';
import cors from 'cors';
import opportunitiesRoute from './routes/opportunities';
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Volunteer API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/api/opportunities', opportunitiesRoute);

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((req, res) => {
  res.status(404).send('Route not found');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;