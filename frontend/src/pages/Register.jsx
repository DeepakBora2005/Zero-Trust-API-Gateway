import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";


const Register = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await api.post(
                "/auth/register",
                form
            );

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">

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
                        Create Account
                    </h2>


                    {error && (
                        <div className="bg-red-950 border border-red-800 text-red-300 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="bg-green-950 border border-green-800 text-green-300 p-3 rounded-lg mb-4 text-sm">
                            {success}
                        </div>
                    )}


                    <div className="mb-4">

                        <label className="block text-sm text-slate-400 mb-2">
                            Name
                        </label>

                        <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            placeholder="Your name"
                            required
                        />

                    </div>


                    <div className="mb-4">

                        <label className="block text-sm text-slate-400 mb-2">
                            Email
                        </label>

                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            placeholder="you@example.com"
                            required
                        />

                    </div>


                    <div className="mb-6">

                        <label className="block text-sm text-slate-400 mb-2">
                            Password
                        </label>

                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            placeholder="Create a password"
                            minLength={6}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg"
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>


                    <p className="text-center text-sm text-slate-500 mt-6">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Sign in
                        </Link>

                    </p>

                </form>

            </div>

        </div>
    );
};


export default Register;