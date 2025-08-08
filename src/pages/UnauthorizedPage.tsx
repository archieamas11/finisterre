import { useNavigate } from "react-router-dom";
import { ShieldX, Home, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Unauthorized Access</CardTitle>
          <CardDescription className="text-muted-foreground">
            You don't have permission to view this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            It looks like you're trying to access a page that requires special permissions.
            Please log in with an authorized account or contact your administrator.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Go to Login
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate("/contact")}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}