import { z } from "zod";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/api/auth.api";
import { FormControl, FormMessage, FormField, FormLabel, FormItem, Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";

const FormSchema = z.object({
  username: z.string().min(3, {
    message: "Property ID must be at least 3 characters.",
  }),
});

export default function ForgotPassword() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const verifyPromise = async () => {
      console.log("Sending forgot password request:", data);
      const res = await forgotPassword(data.username);
      console.log("Forgot password response:", res);

      if (res.success) {
        navigate("/reset-password", {
          state: { username: data.username },
        });
        return "Property ID verified successfully!";
      } else {
        throw new Error(res.message || "Failed to process request");
      }
    };

    toast.promise(verifyPromise(), {
      loading: "🔍 Verifying your Property ID...",
      success: (message) => message,
      error: (err) => ({
        message: err.message,
        description: "Please check your Property ID and try again.",
      }),
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
          <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-muted-foreground mt-1 text-center text-sm">Please enter your property id to verify your account.</p>
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
            <div className="space-y-2">
              <Button className="mt-2 w-full" type="submit">
                Verify
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
