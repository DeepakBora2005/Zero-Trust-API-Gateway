const SecurityLog = require("../models/SecurityLog");
const User = require("../models/User");

const getDashboard = async (req, res) => {

    try {

        const [
            totalRequests,
            totalUsers,
            blockedRequests,
            criticalThreats,
            highThreats,
            loginAttempts,
            failedLogins,
            successfulLogins
        ] = await Promise.all([

            // =========================================
            // Total API requests
            // =========================================

            SecurityLog.countDocuments(),


            // =========================================
            // Total registered users
            // =========================================

            User.countDocuments(),


            // =========================================
            // Blocked requests
            // =========================================

            SecurityLog.countDocuments({
                status: {
                    $gte: 400
                }
            }),


            // =========================================
            // Critical threats
            // =========================================

            SecurityLog.countDocuments({
                severity: "CRITICAL"
            }),


            // =========================================
            // High severity threats
            // =========================================

            SecurityLog.countDocuments({
                severity: "HIGH"
            }),


            // =========================================
            // Total login attempts
            // =========================================

            SecurityLog.countDocuments({
                action: {
                    $in: [
                        "LOGIN_SUCCESS",
                        "LOGIN_FAILED"
                    ]
                }
            }),


            // =========================================
            // Failed logins
            // =========================================

            SecurityLog.countDocuments({
                action: "LOGIN_FAILED"
            }),


            // =========================================
            // Successful logins
            // =========================================

            SecurityLog.countDocuments({
                action: "LOGIN_SUCCESS"
            })

        ]);


        // =========================================
        // Recent security events
        // =========================================

        const recentEvents = await SecurityLog
            .find()
            .sort({
                createdAt: -1
            })
            .limit(10)
            .select(
                "user action severity ip endpoint method status createdAt"
            )
            .populate(
                "user",
                "name email"
            );


        // =========================================
        // Dashboard response
        // =========================================

        res.status(200).json({

            success: true,

            dashboard: {

                // -------------------------------
                // Request statistics
                // -------------------------------

                requests: {

                    total: totalRequests,

                    blocked: blockedRequests,

                    allowed:
                        totalRequests -
                        blockedRequests

                },


                // -------------------------------
                // User statistics
                // -------------------------------

                users: {

                    total: totalUsers

                },


                // -------------------------------
                // Authentication statistics
                // -------------------------------

                authentication: {

                    loginAttempts,

                    failedLogins,

                    successfulLogins

                },


                // -------------------------------
                // Threat statistics
                // -------------------------------

                threats: {

                    critical: criticalThreats,

                    high: highThreats

                },


                // -------------------------------
                // Recent security events
                // -------------------------------

                recentEvents

            }

        });

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to load dashboard"

        });

    }

};


module.exports = {
    getDashboard
};
