import { z } from "zod";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginUser } from "@/api/auth.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from "@/components/ui/form";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const FormSchema = z.object({
  remember: z.boolean().optional(),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
  username: z.string().min(2, { message: "Property ID must be at least 2 characters." }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { data, isSuccess, setAuthFromToken } = useAuthQuery();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    const hasToken = !!localStorage.getItem("token");
    if (hasToken && isSuccess && data?.success) {
      const admin = !!data?.user?.isAdmin;
      navigate(admin ? "/admin" : "/user", { replace: true });
    }
  }, [data, isSuccess, navigate]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const loginPromise = async () => {
      const res = await loginUser(formData.username, formData.password);

      if (res.success) {
        // Save token and role
        localStorage.setItem("token", res.token!);
        localStorage.setItem("isAdmin", res.isAdmin ? "1" : "0");

        // Prime query cache from token to avoid race when redirecting
        setAuthFromToken();

        // Navigate based on role
        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }

        return `Welcome back, ${formData.username}!`;
      } else {
        // Set backend error to form state
        form.setValue("password", "");
        if (res.message === "User not found") {
          form.setError("username", {
            type: "manual",
            message: "Incorrect Property ID or Password",
          });
        } else if (res.message === "Invalid password") {
          form.setError("password", {
            type: "manual",
            message: "Incorrect Property ID or Password",
          });
        }
        throw new Error(res.message || "Login failed");
      }
    };

    toast.promise(loginPromise(), {
      loading: "🔐 Signing you in...",
      success: (message) => message,
      error: (err) =>
        err.message === "User not found" || err.message === "Invalid password" ? "Please check your credentials and try again" : "Something went wrong. Please try again later.",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-sm p-8">
        <div className="mb-8 flex flex-col items-center">
          <Link className="mb-4" to="/">
            <div className="border-primary bg-accent rounded-lg border p-2">
              <MapPin size={30} />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Welcome back! Please enter your credentials.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property ID</FormLabel>
                  <FormControl>
                    <Input placeholder="your property ID" autoComplete="username" id="username" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="username"
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input autoComplete="current-password" placeholder="Password" type="password" id="password" {...field} />
                  </FormControl>
                  <FormMessage /> {/* This will show validation errors */}
                </FormItem>
              )}
              control={form.control}
              name="password"
            />
            <FormField
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="flex cursor-pointer items-center gap-2" htmlFor="login-remember">
                    <Checkbox onCheckedChange={field.onChange} checked={field.value} id="login-remember" className="size-4" />
                    Remember me
                  </FormLabel>
                  <Link className="text-muted-foreground mt-1 block text-xs hover:underline" to="/forgot-password">
                    Forgot your password?
                  </Link>
                </FormItem>
              )}
              control={form.control}
              name="remember"
            />
            <div className="space-y-2">
              <Button className="mt-2 w-full" variant={"default"} type="submit">
                Login
              </Button>
              <Button onClick={() => navigate(-1)} className="w-full" variant="outline" type="button">
                Back
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
