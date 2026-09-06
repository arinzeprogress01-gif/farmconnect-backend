import redisClient from "../config/redis.config.js";

export const createRateLimiter = ({
    keyPrefix,
    maxRequests,
    windowSeconds,
}) => {
    return async (req, res, next) => {
        try {
            const identifier = req.ip;

            const key = `rate-limit:${keyPrefix}:${identifier}`;

            const currentCount = await redisClient.incr(key);

            if (currentCount === 1) {
                await redisClient.expire(key, windowSeconds);
            }

            if (currentCount > maxRequests) {
                const ttl = await redisClient.ttl(key);

                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later.",
                    retryAfter: ttl,
                });
            }

            next();
        } catch (error) {
            console.error("Rate limiter error:", error);

            // Do not block the application if Redis temporarily fails.
            next();
        }
    };
};