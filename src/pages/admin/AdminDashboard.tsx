import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear auth state if needed
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/");
  };
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p>Welcome, admin! This is your dashboard.</p>
      <button
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
