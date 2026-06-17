import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 authentication requests per window
  message: {
    success: false,
    message: "Too many attempts from this IP. Please try again after 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in the Headers
  legacyHeaders: false,  // Disable older rate limit headers
});
