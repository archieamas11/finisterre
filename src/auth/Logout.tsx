import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear authentication tokens or user data
        localStorage.removeItem("authToken");
        // Redirect to login page
        navigate("/login");
    }, [navigate]);

    return (
        <div>
            Logging out...
        </div>
    );
};

export default Logout;
