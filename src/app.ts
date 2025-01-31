import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes"
import authRoutes from "./routes/authRoutes"

// Create a new express application instance
const app = express();


// middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Express + TypeScript Server!' });
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);


export default app;