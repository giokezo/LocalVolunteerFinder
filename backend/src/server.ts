// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your route modules
import opportunityRoutes from './routes/opportunities';
import authRoutes from './routes/auth';
import userRoutes from './routes/users'; // <--- THIS LINE IS CRITICAL

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// --- API Routes ---
// This tells Express: "Any request starting with /api/users should be handled by the userRoutes router."
app.use('/api/users', userRoutes); // <--- THIS LINE IS CRITICAL
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});