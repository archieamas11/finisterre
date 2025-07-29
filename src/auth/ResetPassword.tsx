import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "@/api/auth";
import { MapPin } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";

const FormSchema = z
  .object({
    password: z.string().min(3, {
      message: "Password must be at least 3 characters.",
    }),
    confirm: z.string().min(3, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

type FormSchemaType = z.infer<typeof FormSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialUsername = location.state?.username || "";
  const [username] = useState(initialUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values: FormSchemaType) => {
    setIsSubmitting(true);
    try {
      const response = await resetPassword(username.trim(), values.password);
      if (response.success) {
        toast.success("Password reset successful.");
        navigate("/login");
      } else {
        toast.info(response.message || "Reset failed.");
      }
    } catch (err: any) {
      console.error("Reset error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-12">
      <div className="mx-auto flex flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center justify-center border border-primary/10 bg-primary/10 rounded-full p-3 w-16 h-16 aspect-square mb-5"
            >
              <MapPin className="h-20 w-20" />
            </Link>
          </div>
          <h1 className="text-3xl font-medium">Forgot Password</h1>
          <p className="text-muted-foreground text-sm">Please enter your property id to verify your account.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
            <Button
              className="w-full"
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
