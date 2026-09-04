const express = require("express");

const authenticate = require(
    "../middleware/authMiddleware"
);

const authorize = require(
    "../middleware/roleMiddleware"
);

const {
    getDashboard
} = require("../controllers/dashboardController");


const router = express.Router();


router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    getDashboard
);


module.exports = router;