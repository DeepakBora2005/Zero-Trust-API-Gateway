const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getAllUsers
} = require("../controllers/userController");

const router = express.Router();

router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    getAllUsers
);

module.exports = router;