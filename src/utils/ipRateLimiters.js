import { createRateLimiter } from "../middleware/rateLimiter.middleware.js";

export const registerRateLimiter = createRateLimiter({
    keyPrefix: "register",
    maxRequests: 5,
    windowSeconds: 15 * 60,
});

export const loginRateLimiter = createRateLimiter({
    keyPrefix: "login",
    maxRequests: 10,
    windowSeconds: 15 * 60,
});

export const forgotPasswordRateLimiter = createRateLimiter({
    keyPrefix: "forgot-password",
    maxRequests: 5,
    windowSeconds: 15 * 60,
});

export const verifyOtpRateLimiter = createRateLimiter({
    keyPrefix: "verify-otp",
    maxRequests: 5,
    windowSeconds: 15 * 60,
});

export const resetPasswordRateLimiter = createRateLimiter({
    keyPrefix: "reset-password",
    maxRequests: 5,
    windowSeconds: 15 * 60,
});