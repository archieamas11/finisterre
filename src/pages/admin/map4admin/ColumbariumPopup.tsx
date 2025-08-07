import { toast } from "sonner";
import { useState } from "react";
import { ImLibrary } from "react-icons/im";
import { FaDirections } from "react-icons/fa";
import { ChevronsUpDown, Check, Heart } from "lucide-react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { useQueryClient } from "@tanstack/react-query";
import { Crown, Phone, User, Mail, Save, X } from "lucide-react";

import type { nicheData } from "@/types/niche.types";
import type { ConvertedMarker } from "@/types/map.types";

import { cn } from "@/lib/utils";
import { isAdmin } from "@/utils/Auth.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createLotOwner } from "@/api/lotOwner.api";
import { useNichesByPlot } from "@/hooks/plots-hooks/niche.hooks";
import { useCustomers } from "@/hooks/customer-hooks/customer.hooks";
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import CreateDeceased from "./columbarium-dialogs/CreateDeceasedPage";

interface ColumbariumPopupProps {
  marker: ConvertedMarker;
  onDirectionClick?: () => void;
}

export default function ColumbariumPopup({
  marker,
  onDirectionClick,
}: ColumbariumPopupProps) {
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers();
  const customers = customersData || [];

  const [selectedNiche, setSelectedNiche] = useState<nicheData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showCustomerCombo, setShowCustomerCombo] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [isReservationStep, setIsReservationStep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const rows = parseInt(marker.rows);
  const cols = parseInt(marker.columns);

  // 🔄 Handle customer selection from combobox
  const handleCustomerSelect = (customerId: string) => {
    console.log("👤 Customer selected:", customerId);
    setSelectedCustomer(customerId);
    setComboOpen(false);
    setIsReservationStep(true);
  };

  // ❌ Handle cancellation of reservation
  const handleCancelReservation = () => {
    console.log("❌ Reservation cancelled");
    setSelectedCustomer("");
    setShowCustomerCombo(false);
    setIsReservationStep(false);
  };

  // 💾 Handle saving the reservation
  const queryClient = useQueryClient();
  const handleSaveReservation = async () => {
    if (!selectedNiche || !selectedCustomer) {
      toast.error("Missing required data for reservation");
      return;
    }

    setIsSaving(true);
    const lotOwnerData = {
      selected: 1,
      plot_id: marker.plot_id,
      customer_id: selectedCustomer,
      niche_number: selectedNiche.niche_number,
    };

    createLotOwner(lotOwnerData)
      .then((result) => {
        if (result.success) {
          toast.success("🎉 Niche reserved successfully!");
          // 🔄 Refetch niche data so user sees the update
          queryClient.invalidateQueries({
            queryKey: ["niches", marker.plot_id, rows, cols],
          });
          handleCancelReservation();
          setIsDetailOpen(false);
        } else {
          toast.error(result.message || "Failed to reserve niche");
        }
      })
      .catch((error) => {
        console.error("❌ Error saving reservation:", error);
        toast.error("Failed to save reservation");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // 🔄 Fetch niche data using React Query
  const {
    error,
    isLoading,
    data: nicheData = [],
  } = useNichesByPlot(marker.plot_id, rows, cols);

  const handleNicheClick = (niche: nicheData) => {
    console.log("🎯 Niche selected:", niche);
    setSelectedNiche(niche);
    setIsDetailOpen(true);
  };

  // ❌ Show error state
  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error.message || "Failed to load niche data"}</p>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          variant="outline"
          className="mt-2"
          size="sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        {/* Title skeleton */}
        <Skeleton className="mb-2 h-[24px] w-110 rounded" />
        {/* Subtitle skeleton */}
        <Skeleton className="mb-2 h-[18px] w-110 rounded" />
        {/* Grid skeleton */}
        <Skeleton className="mb-3 h-[200px] w-110 rounded" />
        {/* Legend skeleton */}
        <Skeleton className="h-[36px] w-110 rounded" />
      </>
    );
  }

  return (
    <div className="w-109 p-2">
      <div className="bg-background dark:bg-muted mb-3 flex items-center justify-between rounded-lg border p-3">
        <div>
          <h3 className="text-accent-foreground mb-1 flex items-center gap-2 text-lg font-bold">
            <ImLibrary /> Chamber {marker.plot_id}
          </h3>
          <div className="text-secondary-foreground flex gap-2 text-sm">
            <span>
              <span className="font-medium">Rows:</span> {marker.rows}
            </span>
            <span>
              <span className="font-medium">Columns:</span> {marker.columns}
            </span>
            <span>
              <span className="font-medium">Total:</span> {rows * cols} niches
            </span>
          </div>
        </div>
        {/* Only show directions button if NOT admin */}
        {!isAdmin() && (
          <Button
            className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-md transition-colors"
            style={{ minWidth: "2rem", minHeight: "2rem" }}
            onClick={onDirectionClick}
            variant="secondary"
          >
            <FaDirections className="text-base text-white" />
          </Button>
        )}
      </div>
      {/* 🔢 Grid layout for niches */}
      <div className="mb-3">
        <h4 className="text-secondary-foreground bg-background dark:bg-muted mb-2 rounded-lg border p-3 text-sm font-medium">
          Niche Layout:
        </h4>
        <div
          style={{
            fontSize: "20px",
            scrollbarWidth: "thin",
            gridTemplateColumns: `repeat(${Math.min(cols, 9)}, minmax(0, 1fr))`,
          }}
          className="bg-card grid w-105 gap-1 rounded border p-2"
        >
          {nicheData.map((niche, index) => (
            <button
              key={`${niche.lot_id}-${niche.row}-${niche.col}-${index}`}
              onClick={() => handleNicheClick(niche)}
              className={`flex aspect-square min-h-[40px] cursor-pointer flex-col items-center justify-center rounded border p-1 text-center transition-all duration-200 hover:scale-105 hover:shadow-sm ${getNicheStatusStyle(niche.niche_status)} `}
              title={`${niche.lot_id} - ${niche.niche_status}${niche.owner ? ` (${niche.owner.name})` : ""}`}
            >
              <span className="font-mono text-[10px] leading-tight">
                N{niche.niche_number}
              </span>
              <span className="font-mono text-[11px] leading-tight">
                R{niche.row}C{niche.col}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 🎨 Legend */}
      <div className="bg-background dark:bg-muted mb-3 rounded-lg border p-3">
        <div className="mb-3">
          <h4 className="text-accent-foreground mb-2 text-sm font-medium">
            Legend:
          </h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border border-green-300 bg-green-100"></div>
              <span className="text-secondary-foreground">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border border-yellow-300 bg-yellow-100"></div>
              <span className="text-secondary-foreground">Reserved</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border border-red-300 bg-red-100"></div>
              <span className="text-secondary-foreground">Occupied</span>
            </div>
          </div>
        </div>

        {/* 📊 Summary stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded bg-green-50 p-2 text-center dark:bg-green-200">
            <div className="font-semibold text-green-700">
              {nicheData.filter((n) => n.niche_status === "available").length}
            </div>
            <div className="text-green-600">Available</div>
          </div>
          <div className="rounded bg-yellow-50 p-2 text-center dark:bg-yellow-200">
            <div className="font-semibold text-yellow-700">
              {nicheData.filter((n) => n.niche_status === "reserved").length}
            </div>
            <div className="text-yellow-600">Reserved</div>
          </div>
          <div className="rounded bg-red-50 p-2 text-center dark:bg-red-200">
            <div className="font-semibold text-red-700">
              {nicheData.filter((n) => n.niche_status === "occupied").length}
            </div>
            <div className="text-red-600">Occupied</div>
          </div>
        </div>
      </div>

      {/* Media display */}
      {(() => {
        // 🖼️ Check both file_names_array and file_name properties
        const images = marker.file_names_array || marker.file_name || [];
        if (!isAdmin()) {
          return Array.isArray(images) && images.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-2">
              {images.map((imageUrl, idx) => (
                <img
                  onError={(e) => {
                    console.log("🖼️ Image failed to load:", imageUrl);
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-30 w-full rounded object-cover transition-transform duration-200 hover:scale-105 hover:transform"
                  alt={`Plot media ${idx + 1}`}
                  src={imageUrl}
                  key={idx}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 text-center text-xs text-gray-400">
              No photos available
            </div>
          );
        }
      })()}

      {/* 🔍 Niche Detail Dialog */}
      <Dialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            handleCancelReservation();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Chamber {selectedNiche?.lot_id}
            </DialogTitle>
            {/* ✅ Proper location for description */}
            <DialogDescription className="sr-only">
              Details and actions for the selected chambers niche.
            </DialogDescription>
          </DialogHeader>
          {selectedNiche && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  className={getStatusBadgeVariant(selectedNiche.niche_status)}
                >
                  {selectedNiche.niche_status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  Niche #{selectedNiche.niche_number} - Row {selectedNiche.row},
                  Column {selectedNiche.col}
                </span>
              </div>

              {/* Owner Information */}
              {selectedNiche.owner && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
                      <User className="h-4 w-4 text-primary" />
                      Owner Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="">
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                          <User className="h-5 w-5 text-accent-foreground" />
                        </div>
                      </div>
                      <div className="space-y-0">
                        <p className="font-medium">{selectedNiche.owner.name}</p>
                        <p className="text-xs text-gray-500">LOT ID: {selectedNiche.lot_id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-accent">
                        <Phone className="h-4 w-4 text-accent-foreground" />
                        <span className="text-xs text-accent-foreground">{selectedNiche.owner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-accent">
                        <Mail className="h-4 w-4 text-accent-foreground" />
                        <span className="text-xs text-accent-foreground">{selectedNiche.owner.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action buttons for reserved niches */}
              {selectedNiche.niche_status === "reserved" && (
                <div className="flex gap-2">
                  {/* Add deceased record */}
                  {/* 📨 Pass owner customer_id to CreateDeceased */}
                  <CreateDeceased
                    lotId={selectedNiche.lot_id}
                    onSuccess={() => {
                      // 🔄 Close the detail dialog to show updated niche status
                      setIsDetailOpen(false);
                    }}
                  />
                </div>
              )}

              {/* Deceased Information */}
              {selectedNiche.deceased && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
                      <Heart className="h-4 w-4 text-primary" />
                      Deceased Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="">
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                          <Heart className="h-4 w-4 text-accent-foreground" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{selectedNiche.deceased.name}</p>
                        <p className="text-xs text-gray-500">DECEASED ID: {selectedNiche.deceased.deceased_id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-accent-foreground font-medium">BORN</p>
                        <p className="text-sm font-medium mt-1">{selectedNiche.deceased.dateOfBirth}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-accent-foreground font-medium">DIED</p>
                        <p className="text-sm font-medium mt-1">{selectedNiche.deceased.dateOfDeath}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-xs text-accent-foreground font-medium">INTERMENT</p>
                        <p className="text-sm font-medium mt-1">{selectedNiche.deceased.dateOfInterment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedNiche.niche_status === "available" && (
                <>
                  {/* Available niche message */}
                  <Card className="border-green-200 bg-green-50">
                    <CardContent>
                      <div className="flex items-center justify-center gap-2 text-center text-sm text-green-800">
                        <BsFillPatchCheckFill /> This niche is available for
                        purchase or reservation.
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action buttons for available niches */}
                  {!showCustomerCombo && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowCustomerCombo(true)}
                        className="flex-1"
                        size="sm"
                      >
                        Reserve
                      </Button>
                    </div>
                  )}

                  {/* Customer combobox shown when Reserve is clicked */}
                  {showCustomerCombo && (
                    <div className="bg-muted/50 mt-4 rounded-lg border p-4">
                      <h4 className="text-muted-foreground mb-3 text-sm font-medium">
                        Select Customer for Reservation
                      </h4>

                      {!isReservationStep ? (
                        <Popover onOpenChange={setComboOpen} open={comboOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              className="w-full justify-between"
                              disabled={isLoadingCustomers}
                              aria-expanded={comboOpen}
                              variant="outline"
                              role="combobox"
                            >
                              {selectedCustomer
                                ? (() => {
                                  const customer = customers.find(
                                    (c: any) =>
                                      c.customer_id === selectedCustomer,
                                  );
                                  return customer
                                    ? `${customer.first_name} ${customer.last_name} | ID: ${customer.customer_id}`
                                    : "Select a customer";
                                })()
                                : isLoadingCustomers
                                  ? "Loading customers..."
                                  : "Select a customer"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-107 p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search customer..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {isLoadingCustomers
                                    ? "Loading customers..."
                                    : "No customer found."}
                                </CommandEmpty>
                                <CommandGroup>
                                  {customers.map((customer: any) => (
                                    <CommandItem
                                      value={`${customer.first_name} ${customer.last_name} ${customer.customer_id}`}
                                      onSelect={() => {
                                        handleCustomerSelect(
                                          customer.customer_id,
                                        );
                                      }}
                                      key={customer.customer_id}
                                    >
                                      {customer.first_name} {customer.last_name}{" "}
                                      | ID: {customer.customer_id}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          selectedCustomer ===
                                            customer.customer_id
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        // 🎯 Show selected customer and action buttons
                        <div className="space-y-3">
                          <div className="bg-background rounded-lg border p-3">
                            <p className="text-sm font-medium">
                              Selected Customer:
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {(() => {
                                const customer = customers.find(
                                  (c: any) =>
                                    c.customer_id === selectedCustomer,
                                );
                                return customer
                                  ? `${customer.first_name} ${customer.last_name} (ID: ${customer.customer_id})`
                                  : "Unknown Customer";
                              })()}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                handleCancelReservation();
                                setShowCustomerCombo(false);
                              }}
                              disabled={isSaving}
                              className="flex-1"
                              variant="outline"
                              size="sm"
                            >
                              <X className="mr-1 h-4 w-4" />
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveReservation}
                              disabled={isSaving}
                              className="flex-1"
                              size="sm"
                            >
                              <Save className="mr-1 h-4 w-4" />
                              {isSaving ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 🎨 Get status styling for niche grid items
const getNicheStatusStyle = (status: nicheData["niche_status"]) => {
  switch (status) {
    case "available":
      return "bg-green-100 hover:bg-green-200 border-green-300 text-green-800";
    case "occupied":
      return "bg-red-100 hover:bg-red-200 border-red-300 text-red-800";
    case "reserved":
      return "bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800";
    default:
      return "bg-gray-100 hover:bg-gray-200 border-gray-300";
  }
};

// 🎯 Get status badge styling
const getStatusBadgeVariant = (status: nicheData["niche_status"]) => {
  switch (status) {
    case "available":
      return "bg-green-500 text-white";
    case "occupied":
      return "bg-red-500 text-white";
    case "reserved":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};
