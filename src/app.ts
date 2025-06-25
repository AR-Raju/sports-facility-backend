import cors from "cors";
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import config from "./app/config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

// Database connection for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    if (!config.database_url) {
      throw new Error("DATABASE_URL is not defined");
    }

    await mongoose.connect(config.database_url);
    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Middleware to ensure database connection
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Internal server error",
    });
  }
});

// CORS configuration - MUST be before other middleware
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    console.log("CORS Origin:", origin); // Debug log

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // List of allowed origins
    const allowedOrigins = [
      "https://sports-facility-client-sand.vercel.app",
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "https://localhost:3000",
      "https://localhost:3001",
    ].filter((url): url is string => typeof url === "string" && url.length > 0);

    // Allow any Vercel deployment URLs
    const isVercelUrl = origin.includes(".vercel.app");
    const isNetlifyUrl = origin.includes(".netlify.app");
    const isAllowedOrigin = allowedOrigins.includes(origin);

    if (isAllowedOrigin || isVercelUrl || isNetlifyUrl) {
      console.log("CORS allowed for:", origin);
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
    "X-HTTP-Method-Override",
  ],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// Apply CORS first
app.use(cors(corsOptions));

// Security middleware - adjusted for serverless
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Disable CSP for API
  })
);

// Rate limiting - adjusted for serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Booking specific rate limiting
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 booking requests per windowMs
  message: {
    success: false,
    message: "Too many booking requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting only in production
if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

// Parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sports Facility Booking Platform API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sports Facility Booking Platform API is running!",
    timestamp: new Date().toISOString(),
    database: isConnected ? "connected" : "disconnected",
  });
});

// Apply booking rate limiter to booking routes only in production
if (process.env.NODE_ENV === "production") {
  app.use("/api/bookings", bookingLimiter);
}

// Application routes
app.use("/api", router);

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use(notFound);

export default app;
