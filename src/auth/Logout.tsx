import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "@/utils/auth";
import SpinnerCircle4 from "@/components/spinner-10";


const Logout: React.FC = () => {
    const navigate = useNavigate();
    const hasLoggedOut = React.useRef(false);

    useEffect(() => {
        if (hasLoggedOut.current) return;
        hasLoggedOut.current = true;
        logout();
        toast.success("You have been logged out successfully", { duration: 1000 });
        navigate("/");
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-full">
            <SpinnerCircle4 />
        </div>
    );
};

export default Logout;