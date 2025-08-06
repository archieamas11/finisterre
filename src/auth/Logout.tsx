import { toast } from "sonner";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "@/utils/Auth.utils";
import SpinnerCircle4 from "@/components/ui/spinner-10";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Perform logout and redirect immediately after
    logout();
    toast.success("You have been logged out successfully", { duration: 1000 });
    setLoading(false);
    navigate("/");
  }, [navigate]);

  if (!loading) return null;

  return (
    <div
      className="flex h-full items-center justify-center"
      aria-live="polite"
      role="status"
    >
      <SpinnerCircle4 />
    </div>
  );
};

export default Logout;
