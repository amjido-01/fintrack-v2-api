import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes"
import authRoutes from "./routes/authRoutes"
import workSpaceRoutes from "./routes/workSpaceRoutes"

// Create a new express application instance
const app = express();

// CORS Configuration 
const corsOptions = {
  origin: "http://localhost:3000", // "https://notify-ai.vercel.app", // Replace with your frontend URL
  credentials: true, // Allow server to accept cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Global CORS Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && corsOptions.origin.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
})

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("API is running...");;
  });

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1", workSpaceRoutes)


export default app;