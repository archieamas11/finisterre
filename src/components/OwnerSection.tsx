import { User, Mail, Phone, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OwnerData {
  fullname: string;
  email: string;
  contact: string;
  customer_id: string;
}

interface OwnerSectionProps {
  owner: OwnerData | null;
  fallbackOwner?: {
    fullname?: string;
    email?: string;
    contact?: string;
  };
  isLoading: boolean;
}

export function OwnerSection({
  owner,
  fallbackOwner,
  isLoading,
}: OwnerSectionProps) {
  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardContent className="flex items-center justify-center p-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-muted-foreground text-xs">
              Loading owner...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ownerInfo = owner || fallbackOwner;

  if (!ownerInfo?.fullname) {
    return (
      <Card className="h-fit">
        <CardContent className="p-3 text-center">
          <span className="text-muted-foreground text-xs">
            No owner information
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-1 text-sm">
          <User className="text-primary h-3 w-3" />
          Owner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {/* Full Name */}
        <div>
          <p className="text-sm font-semibold">{ownerInfo.fullname}</p>
          {owner?.customer_id && (
            <Badge variant="secondary" className="mt-1 text-xs">
              ID: {owner.customer_id}
            </Badge>
          )}
        </div>

        {/* Contact Information - Compact */}
        {(ownerInfo.email || ownerInfo.contact) && (
          <div className="space-y-1">
            {ownerInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 flex-shrink-0 text-blue-600" />
                <span className="text-xs break-all">{ownerInfo.email}</span>
              </div>
            )}

            {ownerInfo.contact && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 flex-shrink-0 text-green-600" />
                <span className="text-xs">{ownerInfo.contact}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
