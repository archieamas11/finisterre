import { APP_CONFIG } from "@/config/app-config";
import { LoginPage } from "@/auth/LoginPage";
import { MapPin } from "lucide-react"
import { Link } from "react-router-dom";

export default function LoginV2() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center justify-center lg:hidden border border-primary/10 bg-primary/10 rounded-full p-3 w-16 h-16 aspect-square mb-5"
            >
              <MapPin className="h-20 w-20" />
            </Link>
          </div>
          <h1 className="text-3xl font-medium">Login to your account</h1>
          <p className="text-muted-foreground text-sm">Please enter your details to login.</p>
        </div>
        <div className="space-y-4">
          <LoginPage />
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-center px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
      </div>
    </>
  );
}
