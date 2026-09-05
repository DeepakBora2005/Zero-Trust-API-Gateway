const blockedIPs = new Map();

const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

const blockIP = (ip) => {
    blockedIPs.set(ip, Date.now() + BLOCK_DURATION);
};

const unblockIP = (ip) => {
    blockedIPs.delete(ip);
};

const isIPBlocked = (ip) => {
    const blockedUntil = blockedIPs.get(ip);

    if (!blockedUntil) {
        return false;
    }

    // Block expired
    if (Date.now() >= blockedUntil) {
        blockedIPs.delete(ip);
        return false;
    }

    return true;
};

const getBlockedIPs = () => {
    const activeBlockedIPs = [];

    for (const [ip, blockedUntil] of blockedIPs.entries()) {
        if (Date.now() < blockedUntil) {
            activeBlockedIPs.push({
                ip,
                blockedUntil
            });
        } else {
            blockedIPs.delete(ip);
        }
    }

    return activeBlockedIPs;
};

module.exports = {
    blockIP,
    unblockIP,
    isIPBlocked,
    getBlockedIPs
};
