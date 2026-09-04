const SecurityLog = require("../models/SecurityLog");

const {
    emitSecurityEvent
} = require("../socket/socketServer");


const createSecurityEvent = async ({
    req,
    action,
    status,
    severity,
    metadata = {}
}) => {

    try {

        const event = await SecurityLog.create({

            user: req.user
                ? req.user._id
                : null,

            ip: req.ip,

            method: req.method,

            endpoint: req.originalUrl,

            status,

            action,

            severity,

            userAgent: req.get("user-agent"),

            metadata

        });


        emitSecurityEvent({
            id: event._id,
            action: event.action,
            severity: event.severity,
            ip: event.ip,
            endpoint: event.endpoint,
            method: event.method,
            status: event.status,
            timestamp: event.createdAt
        });


        return event;

    } catch (error) {

        console.error(
            "Security event error:",
            error.message
        );

    }
};


module.exports = createSecurityEvent;