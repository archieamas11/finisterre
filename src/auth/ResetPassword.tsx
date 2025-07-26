import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "./api";
import { MapPin } from 'lucide-react';

export default function ResetPassword() {
    const location = useLocation();
    const initialUsername = location.state?.username || "";
    const [username] = useState(initialUsername);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            setMessage("Passwords do not match.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const data = await resetPassword(username.trim(), password);
            if (data.success) {
                navigate("/login");
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
                    <h2 className="text-2xl font-bold">Reset Password</h2>
                    <h3 className="text-sm text-muted-foreground">Enter your new password below</h3>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="new-password"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm">Confirm Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            placeholder="Confirm password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            autoComplete="new-password"
                            disabled={loading}
                        />
                    </div>
                    {message && <div className="text-sm text-center text-destructive mb-2">{message}</div>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
                <div className="text-center text-sm text-muted-foreground mt-4">
                    <a href="/login" className="underline">Back to Login</a>
                </div>
            </Card>
        </div>
    );
}
