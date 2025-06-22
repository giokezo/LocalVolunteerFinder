"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import your route modules
const opportunities_1 = __importDefault(require("./routes/opportunities"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users")); // <--- THIS LINE IS CRITICAL
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- API Routes ---
// This tells Express: "Any request starting with /api/users should be handled by the userRoutes router."
app.use('/api/users', users_1.default); // <--- THIS LINE IS CRITICAL
app.use('/api/auth', auth_1.default);
app.use('/api/opportunities', opportunities_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
