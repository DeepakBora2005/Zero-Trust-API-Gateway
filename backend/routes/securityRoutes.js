const express = require("express");

const authenticate = require(
    "../middleware/authMiddleware"
);

const authorize = require(
    "../middleware/roleMiddleware"
);

const {
    getSecurityEvents,
    getSecurityStats,
    getThreats,
    manuallyBlockIP,
    manuallyUnblockIP,
    getBlockedIPsController
} = require("../controllers/securityController");

const router = express.Router();


router.get(
    "/events",
    authenticate,
    authorize("ADMIN"),
    getSecurityEvents
);

router.get(
    "/blocked-ips",
    authenticate,
    authorize("ADMIN"),
    getBlockedIPsController
);


router.get(
    "/stats",
    authenticate,
    authorize("ADMIN"),
    getSecurityStats
);


router.get(
    "/threats",
    authenticate,
    authorize("ADMIN"),
    getThreats
);


router.post(
    "/block-ip",
    authenticate,
    authorize("ADMIN"),
    manuallyBlockIP
);


router.post(
    "/unblock-ip",
    authenticate,
    authorize("ADMIN"),
    manuallyUnblockIP
);


module.exports = router;