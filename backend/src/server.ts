import express from 'express';
import cors from 'cors';
import opportunitiesRoute from './routes/opportunities';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Volunteer API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/api/opportunities', opportunitiesRoute);