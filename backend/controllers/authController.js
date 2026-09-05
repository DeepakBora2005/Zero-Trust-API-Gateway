const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const createSecurityEvent = require(
    "../services/securityEventService"
);


const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });

        }


        const existingUser =
            await User.findOne({ email });


        if (existingUser) {

            return res.status(409).json({
                message:
                    "User already exists"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 12);


        const user = await User.create({

            name,
            email,
            password: hashedPassword

        });


        const token =
            generateToken(user);


        return res.status(201).json({

            message:
                "User registered successfully",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });

    }

};


const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }


        const user =
            await User.findOne({ email });


        // ========================================
        // USER NOT FOUND
        // ========================================

        if (!user) {

            await createSecurityEvent({

                req,

                action: "LOGIN_FAILED",

                status: 401,

                severity: "MEDIUM",

                metadata: {
                    reason: "USER_NOT_FOUND"
                }

            });


            return res.status(401).json({

                success: false,

                message:
                    "Invalid credentials"

            });

        }


        // ========================================
        // INVALID PASSWORD
        // ========================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            await createSecurityEvent({

                req,

                action: "LOGIN_FAILED",

                status: 401,

                severity: "MEDIUM",

                metadata: {
                    reason: "INVALID_PASSWORD"
                }

            });


            return res.status(401).json({

                success: false,

                message:
                    "Invalid credentials"

            });

        }


        // ========================================
        // LOGIN SUCCESS
        // ========================================

        const token =
            generateToken(user);


        await createSecurityEvent({

            req,

            user: user._id,

            action: "LOGIN_SUCCESS",

            status: 200,

            severity: "LOW",

            metadata: {
                email: user.email
            }

        });


        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });

    }

};


module.exports = {
    register,
    login
};
