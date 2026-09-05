import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";


const ProtectedRoute = ({ children }) => {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return children;
};


const App = () => {

    return (
        <BrowserRouter>

           <Routes>

    <Route
        path="/login"
        element={<Login />}
    />

    <Route
        path="/register"
        element={<Register />}
    />
    <Route path="/dash" element={<Dashboard />} />
    <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <DashBoard />
            </ProtectedRoute>
        }
    />

    <Route
        path="*"
        element={
            <Navigate
                to="/login"
                replace
            />
        }
    />

</Routes>

        </BrowserRouter>
    );
};


export default App;
