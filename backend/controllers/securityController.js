const SecurityLog = require("../models/SecurityLog");

const {
    blockIP,
    unblockIP,
    getBlockedIPs
} = require("../services/ipBlockService");

const getBlockedIPsController = async (req, res) => {

    res.status(200).json({

        success: true,

        count: getBlockedIPs().length,

        blockedIPs: getBlockedIPs()

    });

};

const getSecurityEvents = async (req, res) => {

    try {

        const events = await SecurityLog
            .find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to retrieve security events"
        });
    }
};


const getSecurityStats = async (req, res) => {

    try {

        const totalRequests =
            await SecurityLog.countDocuments();

        const blocked =
            await SecurityLog.countDocuments({
                status: {
                    $gte: 400
                }
            });

        const critical =
            await SecurityLog.countDocuments({
                severity: "CRITICAL"
            });

        const high =
            await SecurityLog.countDocuments({
                severity: "HIGH"
            });

        const failedLogins =
            await SecurityLog.countDocuments({
                action: "LOGIN_FAILED"
            });

        res.status(200).json({

            success: true,

            stats: {
                totalRequests,
                blocked,
                criticalThreats: critical,
                highThreats: high,
                failedLogins,
                blockedIPs: getBlockedIPs().length
            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to retrieve security statistics"
        });
    }
};


const getThreats = async (req, res) => {

    try {

        const threats = await SecurityLog
            .find({
                severity: {
                    $in: [
                        "HIGH",
                        "CRITICAL"
                    ]
                }
            })
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: threats.length,
            threats
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to retrieve threats"
        });
    }
};


const manuallyBlockIP = async (req, res) => {

    const { ip } = req.body;

    if (!ip) {
        return res.status(400).json({
            success: false,
            message: "IP address required"
        });
    }

    blockIP(ip);

    res.status(200).json({
        success: true,
        message: "IP blocked successfully",
        ip
    });
};


const manuallyUnblockIP = async (req, res) => {

    const { ip } = req.body;

    if (!ip) {
        return res.status(400).json({
            success: false,
            message: "IP address required"
        });
    }

    unblockIP(ip);

    res.status(200).json({
        success: true,
        message: "IP unblocked successfully",
        ip
    });
};




module.exports = {
    getSecurityEvents,
    getSecurityStats,
    getThreats,
    manuallyBlockIP,
    manuallyUnblockIP,
    getBlockedIPsController
};