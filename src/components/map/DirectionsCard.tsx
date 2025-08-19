import { BsFillStopCircleFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Route as RouteIcon } from "lucide-react";
import { formatDistance, formatDuration } from "@/lib/format";
import React from "react";

interface RouteSummary {
  totalDistance?: number;
  totalTime?: number; // seconds
}

interface RouteInstruction {
  text?: string;
  distance?: number; // meters
  time?: number; // seconds
}

export interface DirectionsRouteInfo {
  summary?: RouteSummary | null;
  instructions?: RouteInstruction[] | null;
}

interface DirectionsCardProps {
  isOpen: boolean;
  onClose: () => void;
  routeInfo: DirectionsRouteInfo | null;
}

export function DirectionsCard({ isOpen, onClose, routeInfo }: DirectionsCardProps) {
  const [showAllSteps, setShowAllSteps] = React.useState(false);

  React.useEffect(() => {
    // reset view when route changes
    setShowAllSteps(false);
  }, [routeInfo?.summary?.totalDistance, routeInfo?.summary?.totalTime]);

  if (!isOpen) return null;

  const instructions = routeInfo?.instructions ?? [];
  const mobileSteps = showAllSteps ? instructions : instructions.slice(0, 2);

  return (
    <>
      {/* Mobile drawer-like card */}
      <Card className="rounded-t-5xl fixed right-0 bottom-0 left-0 z-[9999] max-h-[75vh] overflow-auto rounded-br-none rounded-bl-none shadow-lg md:hidden">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="flex items-center justify-between gap-2 text-base">
            <div className="flex items-center gap-2">
              <RouteIcon className="size-4" /> Directions
            </div>
            <Button variant="destructive" size={"icon"} onClick={onClose}>
              <BsFillStopCircleFill />
            </Button>
          </CardTitle>
          {routeInfo?.summary ? (
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                <span className="sr-only">Distance:</span>
                {formatDistance(routeInfo.summary.totalDistance)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" />
                <span className="sr-only">Duration:</span>
                {formatDuration(routeInfo.summary.totalTime)}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Turn-by-turn navigation</p>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          <ol className="max-h-[50vh] space-y-2 overflow-y-auto pr-1" aria-label="Route instructions">
            {mobileSteps.map((ins, idx) => (
              <li key={`m-step-${idx}`} className="flex gap-3 rounded-md border p-3">
                <div className="text-muted-foreground mt-0.5 min-w-6 text-right tabular-nums">{idx + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{ins?.text ?? "Follow the route"}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistance(ins?.distance)} • {formatDuration(ins?.time)}
                  </p>
                </div>
              </li>
            ))}
            {instructions.length === 0 && <li className="text-muted-foreground text-sm">No instructions available for this route.</li>}
          </ol>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {instructions.length > 2 && (
              <Button variant="outline" onClick={() => setShowAllSteps((v) => !v)}>
                {showAllSteps ? "Show first 2" : `Show all (${instructions.length})`}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Desktop / tablet card */}
      <div className="pointer-events-auto absolute top-8 left-8 z-[9999] hidden w-[min(420px,92vw)] md:block">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="flex items-center justify-between gap-2 text-base">
              <div className="flex items-center gap-2">
                <RouteIcon className="size-4" /> Directions
              </div>
              <Button variant="destructive" size={"icon"} onClick={onClose}>
                <BsFillStopCircleFill />
              </Button>
            </CardTitle>
            {routeInfo?.summary ? (
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-5" />
                  <span className="sr-only">Distance:</span>
                  {formatDistance(routeInfo.summary.totalDistance)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-5" />
                  <span className="sr-only">Duration:</span>
                  {formatDuration(routeInfo.summary.totalTime)}
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">Turn-by-turn navigation</p>
            )}
          </CardHeader>
          <ol className="max-h-[50vh] space-y-2 overflow-y-auto px-5" aria-label="Route instructions">
            {instructions.map((ins, idx) => (
              <li key={`d-step-${idx}`} className="flex gap-3 rounded-md border p-3">
                <div className="text-muted-foreground mt-0.5 min-w-6 text-right tabular-nums">{idx + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{ins?.text ?? "Follow the route"}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDistance(ins?.distance)} • {formatDuration(ins?.time)}
                  </p>
                </div>
              </li>
            ))}
            {instructions.length === 0 && <li className="text-muted-foreground text-sm">No instructions available for this route.</li>}
          </ol>
        </Card>
      </div>
    </>
  );
}

export default DirectionsCard;
