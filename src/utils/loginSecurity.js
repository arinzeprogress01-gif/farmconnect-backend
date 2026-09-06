import redisClient from "../config/redis.config.js";

const FAILED_ATTEMPTS_PREFIX = "login-security:failed";
const COOLDOWN_PREFIX = "login-security:cooldown";

const COOLDOWN_SECONDS = 15 * 60;

export const getFailedLoginAttempts = async (userId) => {
    const key = `${FAILED_ATTEMPTS_PREFIX}:${userId}`;

    const attempts = await redisClient.get(key);

    return attempts ? Number(attempts) : 0;
};

export const incrementFailedLoginAttempts = async (userId) => {
    const key = `${FAILED_ATTEMPTS_PREFIX}:${userId}`;

    const attempts = await redisClient.incr(key);

    return attempts;
};

export const startLoginCooldown = async (userId) => {
    const key = `${COOLDOWN_PREFIX}:${userId}`;

    await redisClient.set(key, "1", {
        EX: COOLDOWN_SECONDS,
    });
};

export const getLoginCooldown = async (userId) => {
    const key = `${COOLDOWN_PREFIX}:${userId}`;

    return redisClient.ttl(key);
};

export const isLoginOnCooldown = async (userId) => {
    const ttl = await getLoginCooldown(userId);

    return ttl > 0;
};

export const resetFailedLoginAttempts = async (userId) => {
    const key = `${FAILED_ATTEMPTS_PREFIX}:${userId}`;

    await redisClient.del(key);
};