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
import {
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
  FormItem,
  Form,
} from "@/components/ui/form";

const FormSchema = z.object({
  remember: z.boolean().optional(),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
  username: z.string().min(2, { message: "Property ID must be at least 2 characters." }),
});

export function LoginPage() {
  const navigate = useNavigate();
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
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "1";
    if (token) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    }
  }, [navigate]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const res = await loginUser(data.username, data.password);
      if (res.success) {
        // Save token and role
        localStorage.setItem("token", res.token!);
        localStorage.setItem("isAdmin", res.isAdmin ? "1" : "0");

        // Navigate based on role
        if (res.isAdmin) {
          navigate("/admin");
          toast.success(`Welcome back, ${data.username}!`);
        } else {
          navigate("/user");
          toast.success(`Welcome back, ${data.username}!`);
        }
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
            message: "Incorrect Property ID or Password"
          });
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="your property ID"
                  autoComplete="username"
                  id="username"
                  type="text"
                  {...field}
                />
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
                <Input
                  autoComplete="current-password"
                  placeholder="Password"
                  type="password"
                  id="password"
                  {...field}
                />
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
              <FormLabel className="cursor-pointer flex items-center gap-2" htmlFor="login-remember">
                <Checkbox
                  onCheckedChange={field.onChange}
                  checked={field.value}
                  id="login-remember"
                  className="size-4"
                />
                Remember me
              </FormLabel>
              <Link
                className="text-xs text-muted-foreground hover:underline block mt-1"
                to="/forgot-password"
              >
                Forgot your password?
              </Link>
            </FormItem>
          )}
          control={form.control}
          name="remember"
        />
        <Button className="w-full mt-2" variant={"default"} type="submit">
          Login
        </Button>
        <Button
          onClick={() => navigate(-1)}
          className="w-full"
          variant="outline"
          type="button"
        >
          Back
        </Button>
      </form>
    </Form>
  );
}