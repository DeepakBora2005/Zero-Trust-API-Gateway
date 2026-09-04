const {
    isIPBlocked
} = require("../services/ipBlockService");

const ipFilter = (req, res, next) => {

    const ip = req.ip;

    if (isIPBlocked(ip)) {

        return res.status(403).json({
            success: false,
            message: "IP address blocked"
        });
    }

    next();
};

module.exports = ipFilter;