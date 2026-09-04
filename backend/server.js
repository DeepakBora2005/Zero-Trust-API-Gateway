
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const securityRoutes = require("./routes/securityRoutes");

const logger = require("./middleware/loggerMiddleware");
const ipFilter = require("./middleware/ipFilterMiddleware");
const detectThreats = require("./middleware/threatDetectionMiddleware");

const {
    globalLimiter
} = require("./middleware/rateLimitMiddleware");

const {
    initializeSocket
} = require("./socket/socketServer");

const isSocketRequest = (req) => {
    return req.url.startsWith("/socket.io/");
};

dotenv.config();


// ================================
// Database
// ================================

connectDB();


// ================================
// Express
// ================================

const app = express();

app.set("trust proxy", 1);


// ================================
// CORS
// IMPORTANT: This must come BEFORE routes
// ================================

app.use(
    cors({
        origin: "*",
        credentials: false,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// ================================
// Security
// ================================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);


// ================================
// Body Parsing
// ================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ================================
// Security Gateway
// ================================

app.use((req, res, next) => {

    if (isSocketRequest(req)) {
        return next();
    }

    detectThreats(req, res, next);

});


app.use((req, res, next) => {

    if (isSocketRequest(req)) {
        return next();
    }

    ipFilter(req, res, next);

});


app.use((req, res, next) => {

    if (isSocketRequest(req)) {
        return next();
    }

    globalLimiter(req, res, next);

});


app.use((req, res, next) => {

    if (isSocketRequest(req)) {
        return next();
    }

    logger(req, res, next);

});


// ================================
// Health Check
// ================================

app.get("/health", (req, res) => {

    res.status(200).json({
        status: "OK",
        message: "ZeroTrust API Gateway is running"
    });

});


// ================================
// Routes
// ================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api",
    userRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/admin/dashboard",
    dashboardRoutes
);

app.use(
    "/api/admin/security",
    securityRoutes
);


// ================================
// 404 Handler
// ================================

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});


// ================================
// Global Error Handler
// ================================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        message: "Internal server error"
    });

});


// ================================
// HTTP Server
// ================================

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


// ================================
// Socket.IO
// ================================

initializeSocket(server);


// ================================
// Start
// ================================

server.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});

