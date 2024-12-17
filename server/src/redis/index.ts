import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
    try {
        await client.connect();
        console.log("Redis connected");
    } catch (error) {
        console.log("Error connecting to Redis", error);
    }
}

export { client, connectRedis };