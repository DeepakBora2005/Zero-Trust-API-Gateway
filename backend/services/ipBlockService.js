const blockedIPs = new Set();

const blockIP = (ip) => {
    blockedIPs.add(ip);
};

const unblockIP = (ip) => {
    blockedIPs.delete(ip);
};

const isIPBlocked = (ip) => {
    return blockedIPs.has(ip);
};

const getBlockedIPs = () => {
    return Array.from(blockedIPs);
};

module.exports = {
    blockIP,
    unblockIP,
    isIPBlocked,
    getBlockedIPs
};