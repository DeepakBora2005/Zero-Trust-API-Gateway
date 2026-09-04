const SecurityLog = require("../models/SecurityLog");

const {
    blockIP
} = require("../services/ipBlockService");

const createSecurityEvent = require(
    "../services/securityEventService"
);

const detectThreats = async (req, res, next) => {

    const ip = req.ip;

    try {

        const recentFailures = await SecurityLog.countDocuments({
            ip,
            action: "LOGIN_FAILED",
            createdAt: {
                $gte: new Date(
                    Date.now() - 10 * 60 * 1000
                )
            }
        });

        if (recentFailures >= 5) {

            blockIP(ip);

            await createSecurityEvent({
                req,
                action: "BRUTE_FORCE",
                status: 403,
                severity: "CRITICAL",
                metadata: {
                    failedAttempts: recentFailures
                }
            });

            return res.status(403).json({
                success: false,
                message: "Suspicious activity detected. IP blocked."
            });
        }

        next();

    } catch (error) {

        console.error(
            "Threat detection error:",
            error.message
        );

        next();
    }
};

module.exports = detectThreats;