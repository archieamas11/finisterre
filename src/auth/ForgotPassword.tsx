import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/api/auth";
import { MapPin } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const FormSchema = z.object({
  username: z.string().min(3, {
    message: "Property ID must be at least 3 characters."
  }),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    try {
      console.log("Sending forgot password request:", data);
      const res = await forgotPassword(data.username);
      console.log("Forgot password response:", res);

      if (res.success) {
        navigate("/reset-password", {
          state: { username: data.username }
        });
        toast.success("Property ID verified successfully!", {
          closeButton: true,
        });
      } else {
        toast.error(res.message || "Failed to process request", {
          description: "Please check your Property ID and try again.",
          closeButton: true,
        });
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred. Please try again.", {
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="space-y-6 w-full max-w-md p-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Link to="/">
              <MapPin className="h-8 w-8 text-primary" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-center text-muted-foreground">
            Enter your Property ID to verify your identity.
          </p>
        </div>

        <Form {...form}>
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
                      placeholder="Enter your property ID"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-5"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}