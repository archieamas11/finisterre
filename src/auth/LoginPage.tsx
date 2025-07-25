import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    let hasError = false;
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedUsername) {
      setUserError("Please enter your username.");
      hasError = true;
    } else {
      setUserError("");
    }
    if (!trimmedPassword) {
      setPassError("Please enter your password.");
      hasError = true;
    } else {
      setPassError("");
    }
    if (hasError) return;
    setLoading(true);
    setLoginError("");
    try {
      const { loginUser } = await import("./api");
      // Debug log to verify values sent
      console.log("Sending login:", { username: trimmedUsername, password: trimmedPassword });
      // Ensure payload is correct
      const res = await loginUser(trimmedUsername, trimmedPassword);
      console.log("Login response:", res);
      if (res.success) {
        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setLoginError(res.message || "Invalid username or password.");
      }
    } catch {
      setLoginError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-lg max-w-md p-8 space-y-6 shadow-xl">
        <div className="space-y-1 text-center">
          <MapPin
            className="mx-auto h-12 w-12 text-stone-700"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <h3 className="text-sm text-muted-foreground">Login to your Finisterre Account</h3>
        </div>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleLogin(); }}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="JuanDelacruz"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
            {userError && <div className="text-destructive text-sm">{userError}</div>}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-xs text-muted-foreground hover:underline">Forgot your password?</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
            {passError && <div className="text-destructive text-sm">{passError}</div>}
          </div>
          {loginError && <div className="text-destructive text-sm text-center">{loginError}</div>}
          <Button type="submit" className="w-full mt-5" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
