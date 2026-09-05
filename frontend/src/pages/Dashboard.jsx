```jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Top Navbar */}
      <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <h1 className="text-xl font-semibold text-gray-800">
          Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      {/* Dashboard Content */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          User Logged In
        </h2>
      </main>

    </div>
  );
};

export default Dashboard;
```
