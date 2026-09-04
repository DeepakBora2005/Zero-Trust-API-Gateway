import SecurityEvent from "./SecurityEvent";

const SecurityEvents = ({ events }) => {

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <div className="mb-4">

                <h2 className="text-lg font-semibold text-white">
                    Recent Security Events
                </h2>

                <p className="text-sm text-slate-500">
                    Live gateway activity
                </p>

            </div>


            <div>

                {events.length === 0 ? (

                    <p className="text-slate-500 text-sm">
                        No security events yet.
                    </p>

                ) : (

                    events.map((event) => (
                        <SecurityEvent
                            key={event.id || event._id}
                            event={event}
                        />
                    ))

                )}

            </div>

        </div>
    );
};

export default SecurityEvents;