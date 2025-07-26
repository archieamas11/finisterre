// src/pages/LoginPage.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/api/auth";
import { toast, Toaster } from "sonner";

const FormSchema = z.object({
  username: z.string().min(3, { message: "Property ID must be at least 3 characters." }),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
  remember: z.boolean().optional(),
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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      console.log("Sending login request:", data);
      const res = await loginUser(data.username, data.password);
      console.log("Login response:", res);

      if (res.success) {
        // Save token and role
        localStorage.setItem("token", res.token!);
        localStorage.setItem("isAdmin", res.isAdmin ? "1" : "0");

        // Navigate based on role
        if (res.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        // Set backend error to form state
        form.setValue("password", "");
        if (res.message === "User not found") {
          form.setError("username", {
            type: "manual",
            message: "Incorrect Property ID or Password",
          });
          toast.error("Incorrect Property ID or Password");
        } else if (res.message === "Invalid password") {
          form.setError("password", {
            type: "manual",
            message: "Incorrect Property ID or Password"
          });
        } else {
          // For other errors, show in toast
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

  return (
    <Form {...form}>
      <Toaster />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property ID</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  type="text"
                  placeholder="your property ID"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage /> {/* This will show validation errors */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage /> {/* This will show validation errors */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <FormLabel htmlFor="login-remember" className="cursor-pointer flex items-center gap-2">
                <Checkbox
                  id="login-remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-4"
                />
                Remember me
              </FormLabel>
              <Link
                to="/forgot-password"
                className="text-xs text-muted-foreground hover:underline block mt-1"
              >
                Forgot your password?
              </Link>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
}