import { MapPin } from "lucide-react";
import { type ReactNode } from "react";

import { APP_CONFIG } from "@/config/app-config";
import { Separator } from "@/components/ui/separator";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
          <div className="text-primary-foreground absolute top-10 space-y-1 px-10">
            <MapPin className="size-10" />
            <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
            <p className="text-sm">Not your usual memorial park</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Plan with peace of mind</h2>
              <p className="text-sm">
                Discover serene memorial options and manage arrangements with ease and dignity.
              </p>
            </div>
            <Separator className="mx-3 !h-auto" orientation="vertical" />
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Need assistance?</h2>
              <p className="text-sm">
                Our caring team is here to guide you—contact us or visit our help center for support.
              </p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
