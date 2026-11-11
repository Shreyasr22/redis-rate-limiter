
const express = require("express");

const { client, connectRedis } = require("./redis");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

const PORT = process.env.PORT || 3000;

// Apply rate limiter to this API
app.get("/api/test", rateLimiter, (req, res) => {

    res.status(200).json({
        success: true,
        message: "API is working successfully!"
    });

});

// Start application
async function startServer() {

    await connectRedis();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}

startServer();