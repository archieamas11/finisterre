import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
        <p className="mt-2">You don't have permission to view this page.</p>
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
