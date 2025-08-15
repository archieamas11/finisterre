import { Plus, MapPin, Award, Clock, CheckCircle, XCircle, ChevronsUpDown, Check, Save, X } from "lucide-react";
import type { ConvertedMarker } from "@/types/map.types";
import { isAdmin } from "../../../utils/auth.utils.temp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePlotDetails } from "@/hooks/plots-hooks/usePlotDetails";
import { DeceasedSection } from "@/components/DeceasedSection";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/customer-hooks/customer.hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useCreateLotOwner } from "@/hooks/lot-owner-hooks/useCreateLotOwner";
import { useCreateDeceasedRecord } from "@/hooks/deceased-hooks/useCreateDeceasedRecord";
import { CreateDeceasedRecordDialog } from "@/pages/admin/map4admin/columbarium-dialogs/CreateDeceasedRecordDialog";

interface PlotLocationsProps {
  marker: ConvertedMarker;
  backgroundColor?: string;
  // tick to signal popup close, used to reset local UI like combobox/dialogs
  popupCloseTick?: number;
}

export default function SinglePlotLocations({ marker, popupCloseTick }: PlotLocationsProps) {
  const { data: plotDetails, isLoading: isLoadingDetails } = usePlotDetails(marker.plot_id);

  const ownerData = plotDetails?.owner as (typeof plotDetails extends { owner: infer T } ? T : any) | any;
  const deceasedData = plotDetails?.deceased;

  // UI state for Add actions
  const [isDeceasedDialogOpen, setIsDeceasedDialogOpen] = useState(false);
  const [showCustomerCombo, setShowCustomerCombo] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [isSavingOwner, setIsSavingOwner] = useState(false);

  const queryClient = useQueryClient();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const createLotOwnerMutation = useCreateLotOwner();
  const createDeceasedMutation = useCreateDeceasedRecord();

  // Reset UI when popup closes
  useEffect(() => {
    if (popupCloseTick !== undefined) {
      setShowCustomerCombo(false);
      setComboOpen(false);
      setSelectedCustomer("");
      setIsDeceasedDialogOpen(false);
    }
  }, [popupCloseTick]);

  function openAddFlow() {
    if (!ownerData) {
      setShowCustomerCombo(true);
      return;
    }
    setIsDeceasedDialogOpen(true);
  }

  function handleCustomerSelect(customerId: string) {
    setSelectedCustomer(customerId);
    setComboOpen(false);
  }

  async function handleSaveOwner() {
    if (!selectedCustomer) {
      toast.error("Select a customer first");
      return;
    }
    setIsSavingOwner(true);

    const payload = {
      selected: 1,
      plot_id: marker.plot_id,
      customer_id: selectedCustomer,
      niche_number: null,
    } as const;

    try {
      // ✨ Use the mutation hook instead of direct API call
      const result = await createLotOwnerMutation.mutateAsync(payload);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to save owner");
      }

      toast.success("Owner saved successfully");

      // 🔄 Optimistically update plot details cache
      const customer = (customers as any[]).find((c) => String(c.customer_id) === String(selectedCustomer));
      const optimisticOwner = customer
        ? {
            lot_id: undefined,
            customer_id: String(customer.customer_id),
            fullname: `${customer.first_name} ${customer.last_name}`.trim(),
            email: customer.email ?? "",
            contact: customer.contact_number ?? "",
          }
        : null;

      queryClient.setQueryData(["plotDetails", marker.plot_id], (old: any) => ({
        ...(old || {}),
        owner: optimisticOwner || null,
        deceased: old?.deceased ?? [],
      }));

      // Close UI
      setShowCustomerCombo(false);
      setSelectedCustomer("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save owner");
    } finally {
      setIsSavingOwner(false);
    }
  }

  async function handleCreateDeceased(values: any) {
    const lotId = ownerData?.lot_id;
    const payload = {
      ...values,
      lot_id: values?.lot_id || lotId || "",
      // ✨ Fallback parameters in case lot_id is not available
      plot_id: marker.plot_id,
      customer_id: ownerData?.customer_id || "",
    };

    try {
      await toast.promise(createDeceasedMutation.mutateAsync(payload), {
        loading: "Saving deceased record...",
        success: "Deceased record created",
        error: (e) => e.message || "Failed to create deceased record",
      });

      setIsDeceasedDialogOpen(false);
    } catch (error) {
      // Error is already handled by the toast
      console.error("Failed to create deceased record:", error);
    }
  }

  const handleAdd = () => {
    openAddFlow();
  };

  return (
    <div className="max-w-full">
      <div className="mb-3 grid grid-cols-1 gap-2">
        <Button variant="secondary" size="lg" onClick={handleAdd} className="bg-card text-accent-foreground hover:bg-accent/90 flex items-center gap-1 border px-2 py-1 text-xs">
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      {/* Customer selection dialog for assigning owner */}
      {showCustomerCombo && (
        <div className="bg-card relative mb-3 rounded-lg border p-3">
          <h4 className="text-card-foreground mb-2 text-sm font-medium">Select Customer for Reservation</h4>
          <Popover open={comboOpen} onOpenChange={setComboOpen}>
            <PopoverTrigger asChild className="bg-accent text-muted-foreground">
              <Button className="w-full justify-between" disabled={isLoadingCustomers} aria-expanded={comboOpen} variant="outline" role="combobox">
                {selectedCustomer
                  ? (() => {
                      const c = (customers as any[]).find((x) => String(x.customer_id) === String(selectedCustomer));
                      return c ? `${c.first_name} ${c.last_name} | ID: ${c.customer_id}` : "Select a customer";
                    })()
                  : isLoadingCustomers
                    ? "Loading customers..."
                    : "Select a customer"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-130 p-0">
              <Command className="w-full">
                <CommandInput placeholder="Search customer..." className="h-9" />
                <CommandList>
                  <CommandEmpty>{isLoadingCustomers ? "Loading customers..." : "No customer found."}</CommandEmpty>
                  <CommandGroup>
                    {(customers as any[]).map((c: any) => (
                      <CommandItem value={`${c.first_name} ${c.last_name} ${c.customer_id}`} onSelect={() => handleCustomerSelect(String(c.customer_id))} key={c.customer_id}>
                        {c.first_name} {c.last_name} | ID: {c.customer_id}
                        <Check className={cn("ml-auto h-4 w-4", String(selectedCustomer) === String(c.customer_id) ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => {
                setShowCustomerCombo(false);
                setSelectedCustomer("");
              }}
              variant="destructive"
              size="sm"
              className="flex-1 leading-none"
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveOwner} disabled={isSavingOwner || !selectedCustomer} size="sm" className="flex-1 leading-none">
              <Save className="mr-1 h-4 w-4" />
              {isSavingOwner ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      {/* Deceased creation dialog */}
      {ownerData && (
        <CreateDeceasedRecordDialog
          open={isDeceasedDialogOpen}
          onOpenChange={setIsDeceasedDialogOpen}
          onSubmit={handleCreateDeceased}
          initialValues={{ lot_id: ownerData?.lot_id }}
          isPending={false}
          mode="add"
        />
      )}

      {/* Main Content Grid - Two Columns */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Left Column - Plot Info */}
        <Card className="h-83">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MapPin className="text-primary h-4 w-4" />
              Plot Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {/* Location */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">Location</span>
              </div>
              <span className="font-semibold">{marker.location}</span>
            </div>
            <Separator />

            {/* Status and Category - Row layout */}
            <div className="grid grid-cols-2 gap-2 py-2">
              <div className="text-center">
                <p className="text-muted-foreground mb-1 text-xs">Status</p>
                <Badge variant={marker.plotStatus === "available" ? "default" : marker.plotStatus === "reserved" ? "secondary" : "destructive"} className="text-xs">
                  {marker.plotStatus === "available" && <CheckCircle className="h-2 w-2" />}
                  {marker.plotStatus === "reserved" && <Clock className="h-2 w-2" />}
                  {marker.plotStatus === "occupied" && <XCircle className="h-2 w-2" />}
                  {marker.plotStatus}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-1 text-xs">Category</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    marker.category === "bronze"
                      ? "border-amber-400 text-amber-700"
                      : marker.category === "silver"
                        ? "border-gray-400 text-gray-700"
                        : marker.category === "platinum"
                          ? "border-yellow-400 text-yellow-700"
                          : marker.category === "diamond"
                            ? "border-pink-400 text-pink-700"
                            : "border-gray-300 text-gray-600"
                  }`}
                >
                  <Award className="h-2 w-2" />
                  {marker.category.charAt(0).toUpperCase() + marker.category.slice(1)}
                </Badge>
              </div>
            </div>
            <Separator />

            {/* Dimensions - Improved Design */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">Dimensions</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <span>{isNaN(marker.dimensions.length) || marker.dimensions.length === undefined || marker.dimensions.length === null ? "N/A" : marker.dimensions.length}m</span>
                  <span className="text-muted-foreground">×</span>
                  <span>{isNaN(marker.dimensions.width) || marker.dimensions.width === undefined || marker.dimensions.width === null ? "N/A" : marker.dimensions.width}m</span>
                  <span className="text-muted-foreground">×</span>
                  <span>
                    {isNaN(marker.dimensions.area) || marker.dimensions.area === undefined || marker.dimensions.area === null ? "N/A" : marker.dimensions.area.toLocaleString()}
                    m²
                  </span>
                </div>
                <div className="text-muted-foreground mt-1 text-[10px]">Length × Width × Area</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Combined Owner & Deceased */}
        <div className="space-y-3">
          <DeceasedSection owner={ownerData ?? null} fallbackOwner={marker.owner} deceased={deceasedData || []} isLoading={isLoadingDetails} />
        </div>
      </div>

      {/* Plot Images - Full Width if exists */}
      {(() => {
        const images = marker.file_names_array || marker.file_name || [];
        if (!isAdmin() && Array.isArray(images) && images.length > 0) {
          return (
            <Card className="mt-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(0, 3).map((imageUrl, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden rounded border">
                      <img className="h-full w-full object-cover transition-transform duration-200 hover:scale-105" alt={`Plot image ${idx + 1}`} src={imageUrl} />
                    </div>
                  ))}
                </div>
                {images.length > 3 && <p className="text-muted-foreground mt-1 text-center text-xs">+{images.length - 3} more images</p>}
              </CardContent>
            </Card>
          );
        } else if (!isAdmin()) {
          return (
            <div className="mt-3 text-center">
              <p className="text-muted-foreground text-xs">No images available</p>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
}
