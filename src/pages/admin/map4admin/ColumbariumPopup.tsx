import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronsUpDown, Check, Heart } from "lucide-react";
import { Crown, Phone, User, Mail, Save, X } from "lucide-react";
import { useState } from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaDirections } from "react-icons/fa";
import { ImLibrary } from "react-icons/im";
import { toast } from "sonner";

import type { Customer } from "@/api/customer.api";
import type { ConvertedMarker } from "@/types/map.types";
import type { nicheData } from "@/types/niche.types";

import { ErrorMessage } from "@/components/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command";
import { DialogDescription, DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useCustomers } from "@/hooks/customer-hooks/customer.hooks";
import { useCreateLotOwner } from "@/hooks/lot-owner-hooks/useCreateLotOwner";
import { useNichesByPlot } from "@/hooks/plots-hooks/niche.hooks";
import { cn } from "@/lib/utils";
import { isAdmin } from "@/utils/auth.utils";
import { calculateYearsBuried } from "@/utils/date.utils";

import CreateDeceased from "./columbarium-dialogs/CreateDeceasedPage";

interface ColumbariumPopupProps {
  marker: ConvertedMarker;
  onDirectionClick?: () => void;
  isDirectionLoading?: boolean;
}

export default function ColumbariumPopup({ marker, onDirectionClick, isDirectionLoading = false }: ColumbariumPopupProps) {
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
  const queryClient = useQueryClient();
  const createLotOwnerMutation = useCreateLotOwner();

  const handleCustomerSelect = (customerId: string) => {
    console.log("👤 Customer selected:", customerId);
    setSelectedCustomer(customerId);
    setComboOpen(false);
    setIsReservationStep(true);
  };

  const handleCancelReservation = () => {
    console.log("❌ Reservation cancelled");
    setSelectedCustomer("");
    setShowCustomerCombo(false);
    setIsReservationStep(false);
  };

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

    await toast.promise(createLotOwnerMutation.mutateAsync(lotOwnerData), {
      loading: "Saving reservation...",
      success: () => {
        queryClient.invalidateQueries({
          queryKey: ["niches", marker.plot_id, rows, cols],
        });
        handleCancelReservation();
        setIsDetailOpen(false);
        return "Niche reserved successfully!";
      },
      error: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Error saving reservation:", error);
        return errorMessage || "Failed to save reservation";
      },
    });

    setIsSaving(false);
  };

  // 🔄 Fetch niche data using React Query
  const { error, isLoading, refetch, data: nicheData = [] } = useNichesByPlot(marker.plot_id, rows, cols);

  const handleNicheClick = (niche: nicheData) => {
    if (isAdmin()) {
      setSelectedNiche(niche);
      setIsDetailOpen(true);
    } else {
      setIsDetailOpen(false);
      toast.error("Admin access required to view niche details");
    }
  };

  if (error) {
    return (
      <>
        <ErrorMessage message="Failed to load niche data. Please check your connection and try again." onRetry={() => refetch()} showRetryButton={true} />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Skeleton className="mb-2 h-[24px] w-full rounded" />
        <Skeleton className="mb-2 h-[18px] w-full rounded" />
        <Skeleton className="mb-3 h-[200px] w-full rounded" />
        <Skeleton className="h-[36px] w-full rounded" />
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full">
      <div className="bg-background dark:bg-muted mb-2 flex h-full items-center justify-between rounded-lg border p-3">
        <div>
          <h3 className="text-accent-foreground flex items-center gap-2 text-lg font-bold">
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
            style={{
              minWidth: "2rem",
              minHeight: "2rem",
              background: "#4f46e5",
            }}
            onClick={onDirectionClick}
            disabled={isDirectionLoading}
            aria-busy={isDirectionLoading}
            type="button"
            variant="secondary"
          >
            {isDirectionLoading ? <Spinner className="h-5 w-5 text-white" /> : <FaDirections className="text-base text-white" />}
          </Button>
        )}
      </div>
      {/* 🔢 Grid layout for niches */}
      <div className="mb-2">
        <h4 className="text-secondary-foreground bg-background dark:bg-muted mb-2 rounded-lg border p-3 text-sm font-medium">Niche Layout:</h4>
        <div
          style={{
            fontSize: "20px",
            scrollbarWidth: "thin",
            gridTemplateColumns: `repeat(${Math.min(cols, 9)}, minmax(0, 1fr))`,
          }}
          className="bg-background dark:bg-muted grid w-full gap-1 rounded-lg border p-2"
        >
          {nicheData.map((niche, index) => (
            <button
              key={`${niche.lot_id}-${niche.row}-${niche.col}-${index}`}
              onClick={() => handleNicheClick(niche)}
              className={`flex aspect-square min-h-[40px] cursor-pointer flex-col items-center justify-center rounded border p-1 text-center transition-all duration-200 hover:scale-105 hover:shadow-sm ${getNicheStatusStyle(niche.niche_status)} `}
              title={`${niche.lot_id} - ${niche.niche_status}${niche.owner ? ` (${niche.owner.name})` : ""}`}
            >
              <span className="font-mono text-[10px] leading-tight">N{niche.niche_number}</span>
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
            <div className="font-semibold text-green-700">{nicheData.filter((n) => n.niche_status === "available").length}</div>
            <div className="text-green-600">Available</div>
          </div>
          <div className="rounded bg-yellow-50 p-2 text-center dark:bg-yellow-200">
            <div className="font-semibold text-yellow-700">{nicheData.filter((n) => n.niche_status === "reserved").length}</div>
            <div className="text-yellow-600">Reserved</div>
          </div>
          <div className="rounded bg-red-50 p-2 text-center dark:bg-red-200">
            <div className="font-semibold text-red-700">{nicheData.filter((n) => n.niche_status === "occupied").length}</div>
            <div className="text-red-600">Occupied</div>
          </div>
        </div>
      </div>

      {/* Media display */}
      {(() => {
        const images = marker.file_names_array || marker.file_name || [];
        if (!isAdmin()) {
          return Array.isArray(images) && images.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-2">
              {images.map((imageUrl, idx) => (
                <img
                  className="h-30 w-full rounded object-cover transition-transform duration-200 hover:scale-105 hover:transform"
                  alt={`Plot media ${idx + 1}`}
                  src={imageUrl}
                  key={idx}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 text-center text-xs text-gray-400">No photos available</div>
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
              Chamber {marker.plot_id}
            </DialogTitle>
            {/* ✅ Proper location for description */}
            <DialogDescription className="sr-only">Details and actions for the selected chambers niche.</DialogDescription>
          </DialogHeader>
          {selectedNiche && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge className={getStatusBadgeVariant(selectedNiche.niche_status)}>{selectedNiche.niche_status.toUpperCase()}</Badge>
                <span className="text-sm text-gray-600">
                  Niche #{selectedNiche.niche_number} - Row {selectedNiche.row}, Column {selectedNiche.col}
                </span>
              </div>

              {/* Owner Information */}
              {selectedNiche.owner && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-primary flex items-center gap-2 text-base font-semibold">
                      <User className="text-primary h-4 w-4" />
                      Owner Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="">
                        <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
                          <User className="text-accent-foreground h-5 w-5" />
                        </div>
                      </div>
                      <div className="space-y-0">
                        <p className="font-medium">{selectedNiche.owner.name}</p>
                        <p className="text-xs text-gray-500">LOT ID: {selectedNiche.lot_id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                      <div className="bg-accent flex items-center gap-2 rounded-lg p-2">
                        <Phone className="text-accent-foreground h-4 w-4" />
                        <span className="text-accent-foreground text-xs">{selectedNiche.owner.phone}</span>
                      </div>
                      <div className="bg-accent flex items-center gap-2 rounded-lg p-2">
                        <Mail className="text-accent-foreground h-4 w-4" />
                        <span className="text-accent-foreground text-xs">{selectedNiche.owner.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action buttons for reserved niches */}
              {selectedNiche.niche_status === "reserved" && (
                <div className="flex gap-2">
                  <CreateDeceased
                    lotId={selectedNiche.lot_id}
                    onSuccess={() => {
                      setIsDetailOpen(false);
                    }}
                  />
                </div>
              )}

              {/* Deceased Information */}
              {selectedNiche.deceased && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-primary flex items-center gap-2 text-base font-semibold">
                      <Heart className="text-primary h-4 w-4" />
                      Deceased Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="">
                        <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-full">
                          <Heart className="text-accent-foreground h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{selectedNiche.deceased.name}</p>
                        <p className="text-xs text-gray-500">DECEASED ID: {selectedNiche.deceased.deceased_id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="bg-accent rounded-lg p-3">
                        <p className="text-accent-foreground text-xs font-medium">DIED</p>
                        <p className="mt-1 text-sm font-medium">{selectedNiche.deceased.dateOfDeath}</p>
                      </div>
                      <div className="bg-accent rounded-lg p-3">
                        <p className="text-accent-foreground text-xs font-medium">INTERMENT</p>
                        <p className="mt-1 text-sm font-medium">{selectedNiche.deceased.dateOfInterment}</p>
                      </div>
                      <div className="bg-accent rounded-lg p-3">
                        <p className="text-accent-foreground text-xs font-medium">YEARS BURIED</p>
                        <p className="mt-1 text-sm font-medium">{calculateYearsBuried(selectedNiche.deceased.dateOfInterment)}</p>
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
                        <BsFillPatchCheckFill /> This niche is available for purchase or reservation.
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action buttons for available niches */}
                  {!showCustomerCombo && (
                    <div className="flex gap-2">
                      <Button onClick={() => setShowCustomerCombo(true)} className="flex-1" size="sm">
                        Reserve
                      </Button>
                    </div>
                  )}

                  {/* Customer combobox shown when Reserve is clicked */}
                  {showCustomerCombo && (
                    <div className="bg-muted/50 mt-4 rounded-lg border p-4">
                      <h4 className="text-muted-foreground mb-3 text-sm font-medium">Select Customer for Reservation</h4>

                      {!isReservationStep ? (
                        <Popover onOpenChange={setComboOpen} open={comboOpen}>
                          <PopoverTrigger asChild>
                            <Button className="w-full justify-between" disabled={isLoadingCustomers} aria-expanded={comboOpen} variant="outline" role="combobox">
                              {selectedCustomer
                                ? (() => {
                                    const customer = customers.find((c: Customer) => c.customer_id === selectedCustomer);
                                    return customer ? `${customer.first_name} ${customer.last_name} | ID: ${customer.customer_id}` : "Select a customer";
                                  })()
                                : isLoadingCustomers
                                  ? "Loading customers..."
                                  : "Select a customer"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-107 p-0">
                            <Command>
                              <CommandInput placeholder="Search customer..." className="h-9" />
                              <CommandList>
                                <CommandEmpty>{isLoadingCustomers ? "Loading customers..." : "No customer found."}</CommandEmpty>
                                <CommandGroup>
                                  {customers.map((customer: Customer) => (
                                    <CommandItem
                                      value={`${customer.first_name} ${customer.last_name} ${customer.customer_id}`}
                                      onSelect={() => {
                                        handleCustomerSelect(customer.customer_id);
                                      }}
                                      key={customer.customer_id}
                                    >
                                      {customer.first_name} {customer.last_name} | ID: {customer.customer_id}
                                      <Check className={cn("ml-auto h-4 w-4", selectedCustomer === customer.customer_id ? "opacity-100" : "opacity-0")} />
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
                            <p className="text-sm font-medium">Selected Customer:</p>
                            <p className="text-muted-foreground text-sm">
                              {(() => {
                                const customer = customers.find((c: Customer) => c.customer_id === selectedCustomer);
                                return customer ? `${customer.first_name} ${customer.last_name} (ID: ${customer.customer_id})` : "Unknown Customer";
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
                              variant="destructive"
                              size="sm"
                            >
                              <X className="mr-1 h-4 w-4" />
                              Cancel
                            </Button>
                            <Button onClick={handleSaveReservation} disabled={isSaving} className="flex-1" size="sm">
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
    </motion.div>
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
