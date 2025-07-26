import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "@/utils/auth";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Perform logout
        logout();
        
        // Show success message
        toast.success("You have been logged out successfully");
        
        // Redirect to login (handled by logout function, but we can also do it here)
        navigate("/login");
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Logging out...</p>
            </div>
        </div>
    );
};

export default Logout;