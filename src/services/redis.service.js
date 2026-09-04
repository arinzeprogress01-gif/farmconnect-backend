import redisClient from "../config/redis.config.js";

export const setRedisValue = async (key, value, expirationInSeconds = null) => {
    if (expirationInSeconds) {
        await redisClient.set(key, value, {
            EX: expirationInSeconds,
        });
    } else {
        await redisClient.set(key, value);
    }
};

export const getRedisValue = async (key) => {
    return await redisClient.get(key);
};

export const deleteRedisValue = async (key) => {
    return await redisClient.del(key);
};

export const getRedisTimeToLive = async (key) => {
    return await redisClient.ttl(key);
};

export const incrementRedisValue = async (key) => {
    return await redisClient.incr(key);
};

export const setRedisJson = async (
    key,
    value,
    expirationInSeconds = null
) => {
    const serializedValue = JSON.stringify(value);

    if (expirationInSeconds) {
        await redisClient.set(key, serializedValue, {
            EX: expirationInSeconds,
        });
    } else {
        await redisClient.set(key, serializedValue);
    }
};

export const getRedisJson = async (key) => {
    const value = await redisClient.get(key);

    if (!value) {
        return null;
    }

    return JSON.parse(value);
};