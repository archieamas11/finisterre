import { Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateYearsBuried, formatDate } from "@/utils/dateUtils";

interface DeceasedData {
  deceased_id: string;
  dead_fullname: string;
  dead_gender?: string;
  dead_citizenship?: string;
  dead_civil_status?: string;
  dead_relationship?: string;
  dead_message?: string;
  dead_bio?: string;
  dead_profile_link?: string;
  dead_interment: string;
  dead_birth_date?: string;
  dead_date_death?: string;
}

interface OwnerData {
  fullname: string;
  email: string;
  contact: string;
  customer_id: string;
}

interface CombinedSectionProps {
  owner: OwnerData | null;
  fallbackOwner?: {
    fullname?: string;
    email?: string;
    contact?: string;
  };
  deceased: DeceasedData[];
  isLoading: boolean;
}

export function DeceasedSection({
  owner,
  fallbackOwner,
  deceased,
  isLoading,
}: CombinedSectionProps) {
  if (isLoading) {
    return (
      <Card className="h-fit max-h-[280px]">
        <CardContent className="flex items-center justify-center p-3">
          <div className="flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-muted-foreground text-xs">
              Loading information...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ownerInfo = owner || fallbackOwner;

  return (
    <Card className="h-83">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="text-primary h-4 w-4" />
          Plot Information
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        {/* Owner Section - Ultra Minimal */}
        <div className="">
          {ownerInfo?.fullname ? (
            <div className="pl-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Owner</span>
                <span className="font-semibold"> {ownerInfo.fullname}</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground pl-3 text-xs">
              No owner information
            </p>
          )}
        </div>

        <Separator className="my-2" />

        {/* Deceased Section - Ultra Minimal */}
        <div className="">
          <div className="flex justify-between pl-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                Deceased
              </span>
            </div>
            {deceased && deceased.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-xs">
                {deceased.length}
              </Badge>
            )}
          </div>

          {deceased && deceased.length > 0 ? (
            <div className="mt-2">
              {deceased.slice(0, 2).map((person, index) => {
                const yearsBuried = calculateYearsBuried(person.dead_interment);
                return (
                  <div
                    key={person.deceased_id || index}
                    className="grid-col-2 bg-primary-foreground mb-2 grid rounded-lg border px-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="truncate text-xs font-semibold">
                        {person.dead_fullname}
                      </p>
                      <span className="text-muted-foreground text-xs">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="text-muted-foreground mb-4 text-xs">
                      <span>
                        ⚰️ {formatDate(person.dead_interment)} • ⏰{" "}
                        {yearsBuried}y
                      </span>
                    </div>
                  </div>
                );
              })}
              {deceased.length > 2 && (
                <div className="text-muted-foreground mt-1 border-t pt-1 text-center text-xs">
                  +{deceased.length - 2} more deceased
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground pl-3 text-xs">
              No deceased information
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
