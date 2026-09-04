const SecurityLog = require("../models/SecurityLog");

const getDashboard = async (req, res) => {

    try {

        const [
            totalRequests,
            blockedRequests,
            criticalThreats,
            highThreats,
            failedLogins,
            successfulLogins
        ] = await Promise.all([

            SecurityLog.countDocuments(),

            SecurityLog.countDocuments({
                status: {
                    $gte: 400
                }
            }),

            SecurityLog.countDocuments({
                severity: "CRITICAL"
            }),

            SecurityLog.countDocuments({
                severity: "HIGH"
            }),

            SecurityLog.countDocuments({
                action: "LOGIN_FAILED"
            }),

            SecurityLog.countDocuments({
                action: "LOGIN_SUCCESS"
            })

        ]);


        const recentEvents = await SecurityLog
            .find()
            .sort({
                createdAt: -1
            })
            .limit(10)
            .select(
                "action severity ip endpoint status createdAt"
            );


        res.status(200).json({

            success: true,

            dashboard: {

                requests: {
                    total: totalRequests,
                    blocked: blockedRequests,
                    allowed:
                        totalRequests -
                        blockedRequests
                },

                threats: {
                    critical: criticalThreats,
                    high: highThreats
                },

                authentication: {
                    failedLogins,
                    successfulLogins
                },

                recentEvents

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        });

    }
};


module.exports = {
    getDashboard
};