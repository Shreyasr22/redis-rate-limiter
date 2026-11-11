
const redis = require("redis");

// Create Redis client
const client = redis.createClient({
    url: "redis://localhost:6379"
});

// Handle Redis errors
client.on("error", (error) => {
    console.log("Redis Error:", error);
});

// Connect to Redis
async function connectRedis() {
    await client.connect();
    console.log("Redis connected successfully!");
}

// Export client and connection function
module.exports = { client, connectRedis };
