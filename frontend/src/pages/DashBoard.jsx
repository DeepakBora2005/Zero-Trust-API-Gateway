import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import api from "../services/api";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import SecurityEvents from "../components/SecurityEvents";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const DashBoard = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const [dashboard, setDashboard] = useState(null);

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [verificationFailed, setVerificationFailed] = useState(false);


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response =
                    await api.get(
                        "/admin/dashboard"
                    );

                const data =
                    response.data.dashboard;

                setDashboard(data);

                setEvents(
                    data.recentEvents || []
                );

            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

                // Backend verification failed
                setVerificationFailed(true);

            } finally {

                setLoading(false);

            }
        };


        loadDashboard();


        const socket =
            io("https://zero-trust-bck.onrender.com/");


        socket.on(
            "security_event",
            (event) => {

                setEvents((previous) => [

                    event,

                    ...previous

                ].slice(0, 10));

            }
        );


        return () => {

            socket.disconnect();

        };

    }, []);


    // Logout function
    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    if (loading) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                Loading security dashboard...
            </div>
        );

    }


    // If backend verification fails
    if (verificationFailed) {

        return (
            <div className="min-h-screen bg-slate-950">

                {/* Top Navbar */}
                <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">

                    <h1 className="text-xl font-bold text-white">
                        ZeroTrust
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </nav>


                {/* Logged In Message */}
                <main className="flex items-center justify-center min-h-[calc(100vh-73px)]">

                    <h2 className="text-2xl font-semibold text-white">
                        User Logged In
                    </h2>

                </main>

            </div>
        );

    }


    if (!dashboard) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
                Failed to load dashboard.
            </div>
        );

    }


    return (
        <div className="min-h-screen bg-slate-950">

            <Navbar />


            <main className="max-w-7xl mx-auto px-6 py-8">


                <div className="mb-8">

                    <h2 className="text-2xl font-bold text-white">
                        Security Dashboard
                    </h2>

                    <p className="text-slate-500 mt-1">
                        Real-time API security monitoring
                    </p>

                </div>


                {/* Statistics */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    <StatCard
                        title="Total Requests"
                        value={
                            dashboard.requests.total
                        }
                    />

                    <StatCard
                        title="Allowed"
                        value={
                            dashboard.requests.allowed
                        }
                    />

                    <StatCard
                        title="Blocked"
                        value={
                            dashboard.requests.blocked
                        }
                    />

                    <StatCard
                        title="Critical Threats"
                        value={
                            dashboard.threats.critical
                        }
                    />

                </div>


                {/* Authentication */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                    <StatCard
                        title="Successful Logins"
                        value={
                            dashboard.authentication
                                .successfulLogins
                        }
                    />

                    <StatCard
                        title="Failed Logins"
                        value={
                            dashboard.authentication
                                .failedLogins
                        }
                    />

                </div>


                {/* Events */}

                <SecurityEvents
                    events={events}
                />

            </main>

        </div>
    );
};


export default DashBoard;
