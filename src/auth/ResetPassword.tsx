import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { resetPassword } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z
  .object({
    confirm: z.string().min(2, { message: "Please confirm your password." }),
    password: z.string().min(3, { message: "Password must be at least 3 characters." }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

type FormSchemaType = z.infer<typeof FormSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialUsername = location.state?.username || "";
  const [username] = useState(initialUsername);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirm: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormSchemaType) => {
    const resetPromise = async () => {
      const response = await resetPassword(username.trim(), values.password);

      if (response.success) {
        navigate("/login");
        return "Password reset successful!";
      } else {
        throw new Error(response.message || "Reset failed");
      }
    };

    toast.promise(resetPromise(), {
      loading: "🔐 Resetting your password...",
      success: (message) => message,
      error: (err) => err.message || "An unexpected error occurred.",
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
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground mt-1 text-center text-sm">Please enter your new password.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new password" autoComplete="new-password" id="new-password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="password"
            />

            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm your new password" autoComplete="new-password" id="confirm-password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="confirm"
            />

            <div className="space-y-2">
              <Button className="mt-2 w-full" type="submit">
                Reset Password
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
