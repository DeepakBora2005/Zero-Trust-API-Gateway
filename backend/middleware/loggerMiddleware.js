const SecurityLog = require("../models/SecurityLog");

const logger = async (req, res, next) => {

    const start = Date.now();

    res.on("finish", async () => {

        try {

            const duration = Date.now() - start;

            let action = "API_ACCESS";

            if (res.statusCode === 401) {
                action = "UNAUTHORIZED";
            }

            if (res.statusCode === 403) {
                action = "ACCESS_DENIED";
            }

            if (res.statusCode === 429) {
                action = "RATE_LIMIT_EXCEEDED";
            }

            await SecurityLog.create({

                user: req.user
                    ? req.user._id
                    : null,

                ip: req.ip,

                method: req.method,

                endpoint: req.originalUrl,

                status: res.statusCode,

                action,

                userAgent: req.get("user-agent"),

                metadata: {
                    duration
                }

            });

            console.log(
                `[SECURITY] ${req.method} ${req.originalUrl} ${res.statusCode}`
            );

        } catch (error) {

            console.error(
                "Security logging failed:",
                error.message
            );

        }
    });

    next();
};

module.exports = logger;