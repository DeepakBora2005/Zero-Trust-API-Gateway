import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const { user, logout } = useAuth();

    return (
        <header className="border-b border-slate-800 bg-slate-950">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <div>

                    <h1 className="text-xl font-bold text-white">
                        ZeroTrust Gateway
                    </h1>

                    <p className="text-xs text-slate-500">
                        Security Operations Console
                    </p>

                </div>


                <div className="flex items-center gap-4">

                    <div className="text-right">

                        <p className="text-sm text-white">
                            {user?.name}
                        </p>

                        <p className="text-xs text-slate-500">
                            {user?.role}
                        </p>

                    </div>


                    <button
                        onClick={logout}
                        className="text-sm text-slate-400 hover:text-white"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </header>
    );
};

export default Navbar;