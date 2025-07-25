import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "./api";
import { MapPin } from 'lucide-react';

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) {
      setMessage("Please enter your username.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const data = await forgotPassword(username.trim());
      if (data.success) {
        navigate("/reset-password", { state: { username: username.trim() } });
      } else {
        setMessage(data.message || "User not found");
      }
    } catch {
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
        <div className="space-y-1 text-center">
          <MapPin
            className="mx-auto h-12 w-12 text-stone-700"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          <h2 className="text-2xl font-bold">Forgot your password?</h2>
          <h3 className="text-sm text-muted-foreground">Enter your username to reset your password</h3>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="JuanDelacruz"
              value={username}
              onChange={e => setUsername((e.target as HTMLInputElement).value)}
              autoComplete="username"
              disabled={loading}
            />
          </div>
          {message && <div className="text-sm text-destructive">{message}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground mt-4">
          Remembered your password? <a href="/login" className="underline">Login</a>
        </div>
      </Card>
    </div>
  );
}
