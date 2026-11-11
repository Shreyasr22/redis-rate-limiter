
const { client } = require("../redis");

// Redis Lua script for atomic rate limiting
const rateLimitScript = `
    local count = redis.call("INCR", KEYS[1])

    if count == 1 then
        redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    return count
`;

const LIMIT = 5;
const WINDOW = 60;

async function rateLimiter(req, res, next) {
    try {
        // Get user ID from request header
        const userId = req.headers["x-user-id"];

        // Check whether user ID is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Create separate Redis key for each user
        const key = `rate_limit:${userId}`;

        // Execute atomic Redis Lua script
        const count = await client.eval(rateLimitScript, {
            keys: [key],
            arguments: [WINDOW.toString()]
        });

        // Check request limit
        if (count > LIMIT) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Try again later."
            });
        }

        // Allow request
        next();

    } catch (error) {
        console.log("Rate limiter error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = rateLimiter;
