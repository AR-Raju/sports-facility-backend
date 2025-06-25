import cors from "cors";
import express, { Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Booking specific rate limiting
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 booking requests per windowMs
  message: {
    success: false,
    message: "Too many booking requests, please try again later.",
  },
});

app.use(limiter);

// CORS configuration
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000"].filter(
  (origin): origin is string => typeof origin === "string"
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // Allow requests from the client URL or localhost or all origins
    credentials: true,
  })
);

// Parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sports Facility Booking Platform API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Apply booking rate limiter to booking routes
app.use("/api/bookings", bookingLimiter);

// Application routes
app.use("/api", router);

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use(notFound);

export default app;
