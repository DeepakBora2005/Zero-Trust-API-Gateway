import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            console.log("LOGIN SUCCESS:", response.data);

login(response.data);

console.log("Navigating to dashboard...");

navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-white">
                        ZeroTrust
                    </h1>

                    <p className="text-slate-400 mt-2">
                        API Security Gateway
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-8"
                >

                    <h2 className="text-xl font-semibold text-white mb-6">
                        Security Console
                    </h2>

                    {error && (
                        <div className="bg-red-950 border border-red-800 text-red-300 p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">

                        <label className="block text-sm text-slate-400 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            required
                        />

                    </div>

                    <div className="mb-6">

                        <label className="block text-sm text-slate-400 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg"
                    >
                        {loading
                            ? "Authenticating..."
                            : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-6">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Create account
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
};

export default Login;
