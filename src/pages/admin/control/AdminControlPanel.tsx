import { User, Settings, FileText, Shield, Bell, BellOff, ArchiveIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AdminControlPanel() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8" aria-label="Admin Control Panel">
      <div className="flex items-center gap-2">
        <Shield strokeWidth={2.5} className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Admin Control Panel</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-col">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and permissions.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Go to Users
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure site preferences and options.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Edit Settings
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View system logs and activity reports.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              View Logs
            </Button>
          </CardFooter>
        </Card>
        <Card className="border-red-400">
          <CardHeader className="flex flex-row items-center gap-2">
            <ArchiveIcon className="w-5 h-5 text-red-300" />
            <CardTitle className="text-red-300">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage and view archived data in all tables.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              View archived data
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* Toggles Section */}
      <Card className="mt-8 max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Admin Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Shield className="w-4 h-4 text-primary" />
                Maintenance Mode
              </span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Bell className="w-4 h-4 text-primary" />
                Send Notifications
              </span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <BellOff className="w-4 h-4 text-primary" />
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