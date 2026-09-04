const User = require("../models/User");

const getProfile = async (req, res) => {
    return res.status(200).json({
        message: "Profile retrieved successfully",
        user: req.user
    });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getProfile,
    getAllUsers
};