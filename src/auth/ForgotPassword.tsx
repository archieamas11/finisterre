import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/api/auth.api";
import { MapPin } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";

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
              className="w-full mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
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