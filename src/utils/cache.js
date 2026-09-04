import {
    getRedisJson,
    setRedisJson,
    deleteRedisValue,
    incrementRedisValue,
    getRedisValue,
    setRedisValue,
} from "../services/redis.service.js";

const CACHE_PREFIX = "farmconnect";

const buildCacheKey = (namespace, identifier = "") => {
    return identifier
        ? `${CACHE_PREFIX}:${namespace}:${identifier}`
        : `${CACHE_PREFIX}:${namespace}`;
};

const cache = {

    async get(namespace, identifier = "") {

        const key = buildCacheKey(
            namespace,
            identifier
        );

        return await getRedisJson(key);
    },

    async set(
        namespace,
        identifier,
        value,
        expirationInSeconds
    ) {

        const key = buildCacheKey(
            namespace,
            identifier
        );

        await setRedisJson(
            key,
            value,
            expirationInSeconds
        );
    },

    async delete(
        namespace,
        identifier = ""
    ) {

        const key = buildCacheKey(
            namespace,
            identifier
        );

        await deleteRedisValue(key);
    },

    async increment(
        namespace,
        identifier = ""
    ) {

        const key = buildCacheKey(
            namespace,
            identifier
        );

        return await incrementRedisValue(key);
    },

    async getOrSetVersion(
        namespace
    ) {

        const key = buildCacheKey(
            `${namespace}-version`
        );

        let version = await getRedisValue(key);

        if (!version) {

            await setRedisValue(
                key,
                "1"
            );

            version = "1";
        }

        return version;
    },

    async invalidateVersion(
        namespace
    ) {

        const key = buildCacheKey(
            `${namespace}-version`
        );

        return await incrementRedisValue(key);
    },

    buildKey(namespace, identifier = "") {

        return buildCacheKey(
            namespace,
            identifier
        );
    },
};

export default cache;