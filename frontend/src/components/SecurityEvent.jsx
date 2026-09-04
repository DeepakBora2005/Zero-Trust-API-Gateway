const severityClasses = {
    LOW: "text-green-400",
    MEDIUM: "text-yellow-400",
    HIGH: "text-orange-400",
    CRITICAL: "text-red-400"
};


const SecurityEvent = ({ event }) => {

    const severity =
        severityClasses[event.severity] ||
        "text-slate-400";


    return (
        <div className="flex items-center justify-between border-b border-slate-800 py-4">

            <div>

                <p className="text-sm font-medium text-white">
                    {event.action}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                    {event.method} {event.endpoint}
                </p>

            </div>


            <div className="text-right">

                <p className={`text-xs font-semibold ${severity}`}>
                    {event.severity}
                </p>

                <p className="text-xs text-slate-600 mt-1">
                    {event.ip}
                </p>

            </div>

        </div>
    );
};

export default SecurityEvent;