import { Users } from "lucide-react";
import { GiCoffin } from "react-icons/gi";
import { HiClock } from "react-icons/hi";

import type { CustomerData } from "@/types/customer.types";
import type { DeceasedData as DeceasedType } from "@/types/deceased.types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateYearsBuried, formatDate } from "@/utils/date.utils";

type OwnerData = Partial<Pick<CustomerData, "fullname" | "customer_id">>;
type DeceasedItem = Partial<Pick<DeceasedType, "dead_fullname" | "dead_interment" | "deceased_id">>;

interface CombinedSectionProps {
  owner: OwnerData | null;
  deceased: DeceasedItem[];
  isLoading: boolean;
}

export function DeceasedSection({ owner, deceased, isLoading }: CombinedSectionProps) {
  if (isLoading) {
    return (
      <Card className="h-83">
        <CardContent className="p-3">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <div className="mt-10 flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="mt-3 flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/10" />
            </div>
            <Skeleton className="h-17 w-full" />
            <Skeleton className="h-17 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-83">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="text-primary h-4 w-4" />
          Plot Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {owner?.customer_id ? (
          <div className="pl-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Owner</span>
              <span className="font-semibold">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex h-5 w-5 items-center justify-center">#{owner.customer_id}</div>
                  <div className="ml-2">{owner.fullname}</div>
                </div>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground pl-3 text-xs">No owner information</p>
        )}

        <Separator className="my-2" />
        <div className="flex justify-between pl-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Deceased</span>
          </div>
          {deceased && deceased.length > 0 && (
            <Badge variant="secondary" className="h-4 px-1 text-xs">
              #{deceased.length}
            </Badge>
          )}
        </div>

        {deceased && deceased.length > 0 ? (
          <div className="mt-3">
            {deceased.slice(0, 2).map((person) => {
              const interment = person.dead_interment ?? "";
              const yearsBuried = calculateYearsBuried(interment);
              return (
                <div className="grid-col-2 mb-2 grid rounded-lg border px-2 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-semibold">{person.dead_fullname}</p>
                    <span className="text-muted-foreground text-xs">#{person.deceased_id}</span>
                  </div>
                  <div className="text-muted-foreground mb-4 flex items-center justify-between gap-1 text-xs">
                    <span className="flex items-center justify-center gap-1">
                      <GiCoffin /> {formatDate(interment)}
                    </span>
                    <span className="flex items-center justify-center gap-1">
                      <HiClock /> {yearsBuried}
                    </span>
                  </div>
                </div>
              );
            })}
            {deceased.length > 2 && <div className="text-muted-foreground mt-1 border-t pt-1 text-center text-xs">+{deceased.length - 2} more deceased</div>}
          </div>
        ) : (
          <p className="text-muted-foreground pl-3 text-xs">No deceased information</p>
        )}
      </CardContent>
    </Card>
  );
}
