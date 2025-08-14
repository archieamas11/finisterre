import { ArchiveIcon, Settings, FileText, BellOff, Shield, User, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CardContent, CardHeader, CardFooter, CardTitle, Card } from "@/components/ui/card";

export default function AdminControlPanel() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8" aria-label="Admin Control Panel">
      <div className="flex items-center gap-2">
        <Shield className="text-primary h-6 w-6" strokeWidth={2.5} />
        <h2 className="text-primary text-2xl font-bold">Admin Control Panel</h2>
      </div>
      <div className="grid grid-cols-1 flex-col gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="text-primary h-5 w-5" />
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Manage users, roles, and permissions.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              Go to Users
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Settings className="text-primary h-5 w-5" />
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Configure site preferences and options.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              Edit Settings
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">View system logs and activity reports.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Logs
            </Button>
          </CardFooter>
        </Card>
        <Card className="border-red-400">
          <CardHeader className="flex flex-row items-center gap-2">
            <ArchiveIcon className="h-5 w-5 text-red-300" />
            <CardTitle className="text-red-300">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Manage and view archived data in all tables.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View archived data
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* Toggles Section */}
      <Card className="mt-8 max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="text-primary h-5 w-5" />
            Admin Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Shield className="text-primary h-4 w-4" />
                Maintenance Mode
              </span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Bell className="text-primary h-4 w-4" />
                Send Notifications
              </span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <BellOff className="text-primary h-4 w-4" />
                Receive Notifications
              </span>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
