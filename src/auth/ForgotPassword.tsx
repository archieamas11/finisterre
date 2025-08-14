import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/api/auth.api";
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from "@/components/ui/form";

const FormSchema = z.object({
  username: z.string().min(3, {
    message: "Property ID must be at least 3 characters.",
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
          state: { username: data.username },
        });
        toast.success("Property ID verified successfully!", {
          closeButton: true,
        });
      } else {
        toast.error(res.message || "Failed to process request", {
          closeButton: true,
          description: "Please check your Property ID and try again.",
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
    <div className="flex min-h-screen items-center justify-center p-12">
      <div className="mx-auto flex flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <Link className="border-primary/10 bg-primary/10 mb-5 flex aspect-square h-16 w-16 items-center justify-center rounded-full border p-3" to="/">
              <MapPin className="h-20 w-20" />
            </Link>
          </div>
          <h1 className="text-3xl font-medium">Forgot Password</h1>
          <p className="text-muted-foreground text-sm">Please enter your property id to verify your account.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your property ID" autoComplete="username" id="username" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              control={form.control}
              name="username"
            />
            <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
            <Button onClick={() => navigate(-1)} className="w-full" variant="outline" type="button">
              Back
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
