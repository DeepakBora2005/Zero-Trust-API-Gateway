const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        ip: {
            type: String,
            required: true,
            index: true
        },

        method: {
            type: String,
            required: true
        },

        endpoint: {
            type: String,
            required: true
        },

        status: {
            type: Number,
            required: true
        },

        action: {
            type: String,
            required: true,
            index: true
        },

        severity: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            default: "LOW",
            index: true
        },

        userAgent: {
            type: String,
            default: null
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SecurityLog",
    securityLogSchema
);