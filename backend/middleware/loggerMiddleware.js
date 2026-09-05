const SecurityLog = require("../models/SecurityLog");

const logger = async (req, res, next) => {

    const start = Date.now();

    res.on("finish", async () => {

        try {

            const duration = Date.now() - start;

            // =========================================
            // Determine request type
            // =========================================

            const isLoginRequest =
                req.method === "POST" &&
                req.path === "/api/auth/login";


            // =========================================
            // Determine security action
            // =========================================

            let action = "API_ACCESS";

            let severity = "LOW";


            // =========================================
            // Authentication events
            // =========================================

            if (isLoginRequest) {

                if (
                    res.statusCode >= 200 &&
                    res.statusCode < 300
                ) {

                    action = "LOGIN_SUCCESS";
                    severity = "LOW";

                } else {

                    action = "LOGIN_FAILED";
                    severity = "MEDIUM";

                }

            }


            // =========================================
            // General security events
            // =========================================

            else {

                if (res.statusCode === 401) {

                    action = "UNAUTHORIZED";
                    severity = "MEDIUM";

                }

                else if (res.statusCode === 403) {

                    action = "ACCESS_DENIED";
                    severity = "HIGH";

                }

                else if (res.statusCode === 429) {

                    action = "RATE_LIMIT_EXCEEDED";
                    severity = "HIGH";

                }

                else if (res.statusCode >= 500) {

                    action = "SERVER_ERROR";
                    severity = "HIGH";

                }

            }


            // =========================================
            // Store security log
            // =========================================

            await SecurityLog.create({

                user: req.user
                    ? req.user._id
                    : null,

                ip: req.ip,

                method: req.method,

                endpoint: req.originalUrl,

                status: res.statusCode,

                action,

                severity,

                userAgent: req.get("user-agent"),

                metadata: {
                    duration
                }

            });


            // =========================================
            // Console logging
            // =========================================

            console.log(
                `[SECURITY] ${req.method} ${req.originalUrl} ${res.statusCode} [${action}]`
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
