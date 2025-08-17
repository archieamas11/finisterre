import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createSerenityLawnPlot, createMemorialChambersPlot, createColumbariumPlot } from "@/api/plots.api";
import type { MarkerType, CreateSerenityLawnRequest, CreateMemorialChambersRequest, CreateColumbariumRequest } from "@/types/map.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DialogStack,
  DialogStackOverlay,
  DialogStackBody,
  DialogStackContent,
  DialogStackHeader,
  DialogStackTitle,
  DialogStackFooter,
  DialogStackNext,
  DialogStackPrevious,
} from "@/components/ui/kibo-ui/dialog-stack";

// 🎯 Schema for marker type selection
const MarkerTypeSchema = z.object({
  markerType: z.enum(["Serenity Lawn", "Columbarium", "Memorial Chambers"], {
    message: "Please select a marker type",
  }),
});

// 🌿 Schema for Serenity Lawn
const SerenityLawnSchema = z.object({
  category: z.enum(["Bronze", "Silver", "Platinum", "Diamond"], {
    message: "Category is required",
  }),
  block: z.enum(["A", "B", "C", "D"], {
    message: "Block is required",
  }),
});

// 🏛️ Schema for Memorial Chambers
const MemorialChambersSchema = z.object({
  rows: z.string().min(1, "Rows is required"),
  columns: z.string().min(1, "Columns is required"),
});

// 🏺 Schema for Columbarium
const ColumbariumSchema = z.object({
  rows: z.string().min(1, "Rows is required"),
  columns: z.string().min(1, "Columns is required"),
});

type MarkerTypeFormData = z.infer<typeof MarkerTypeSchema>;
type SerenityLawnFormData = z.infer<typeof SerenityLawnSchema>;
type MemorialChambersFormData = z.infer<typeof MemorialChambersSchema>;
type ColumbariumFormData = z.infer<typeof ColumbariumSchema>;

interface AddPlotMarkerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: [number, number] | null;
}

export default function AddPlotMarkerDialog({ open, onOpenChange, coordinates }: AddPlotMarkerDialogProps) {
  const queryClient = useQueryClient();
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType | null>(null);

  // 🔄 Form setup for marker type selection
  const markerTypeForm = useForm<MarkerTypeFormData>({
    resolver: zodResolver(MarkerTypeSchema),
    defaultValues: {
      markerType: undefined,
    },
  });

  // 🌿 Form setup for Serenity Lawn
  const serenityLawnForm = useForm<SerenityLawnFormData>({
    resolver: zodResolver(SerenityLawnSchema),
    defaultValues: {
      category: undefined,
      block: undefined,
    },
  });

  // 🏛️ Form setup for Memorial Chambers
  const memorialChambersForm = useForm<MemorialChambersFormData>({
    resolver: zodResolver(MemorialChambersSchema),
    defaultValues: {
      rows: "",
      columns: "",
    },
  });

  // 🏺 Form setup for Columbarium
  const columbariumForm = useForm<ColumbariumFormData>({
    resolver: zodResolver(ColumbariumSchema),
    defaultValues: {
      rows: "",
      columns: "",
    },
  });

  // 🚀 Mutations for creating different plot types
  const createSerenityLawnMutation = useMutation({
    mutationFn: (data: CreateSerenityLawnRequest) => createSerenityLawnPlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "chambers"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "serenity"] });
      onOpenChange(false);
      resetAllForms();
    },
    onError: (error) => {
      console.error("Error creating Serenity Lawn plot:", error);
    },
  });

  const createMemorialChambersMutation = useMutation({
    mutationFn: (data: CreateMemorialChambersRequest) => createMemorialChambersPlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "chambers"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "serenity"] });
      onOpenChange(false);
      resetAllForms();
    },
    onError: (error) => {
      console.error("Error creating Memorial Chambers plot:", error);
    },
  });

  const createColumbariumMutation = useMutation({
    mutationFn: (data: CreateColumbariumRequest) => createColumbariumPlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "chambers"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "serenity"] });
      onOpenChange(false);
      resetAllForms();
    },
    onError: (error) => {
      console.error("Error creating Columbarium plot:", error);
    },
  });

  // 🧹 Reset all forms
  const resetAllForms = () => {
    markerTypeForm.reset();
    serenityLawnForm.reset();
    memorialChambersForm.reset();
    columbariumForm.reset();
    setSelectedMarkerType(null);
  };

  // 🎯 Handle marker type selection and move to next step
  const onMarkerTypeSelect = (data: MarkerTypeFormData) => {
    setSelectedMarkerType(data.markerType);
  };

  // 📤 Handle Serenity Lawn submission
  const onSerenityLawnSubmit = (data: SerenityLawnFormData) => {
    if (!coordinates) return;

    const coordinatesString = `${coordinates[1]}, ${coordinates[0]}`;
    const plotData: CreateSerenityLawnRequest = {
      ...data,
      coordinates: coordinatesString,
    };

    toast.promise(createSerenityLawnMutation.mutateAsync(plotData), {
      loading: "Creating Serenity Lawn plot...",
      success: "Serenity Lawn plot created successfully!",
      error: "Failed to create plot. Please try again.",
    });
  };

  // 📤 Handle Memorial Chambers submission
  const onMemorialChambersSubmit = (data: MemorialChambersFormData) => {
    if (!coordinates) return;

    const coordinatesString = `${coordinates[1]}, ${coordinates[0]}`;
    const plotData: CreateMemorialChambersRequest = {
      ...data,
      coordinates: coordinatesString,
    };

    toast.promise(createMemorialChambersMutation.mutateAsync(plotData), {
      loading: "Creating Memorial Chambers plot...",
      success: "Memorial Chambers plot created successfully!",
      error: "Failed to create plot. Please try again.",
    });
  };

  // 📤 Handle Columbarium submission
  const onColumbariumSubmit = (data: ColumbariumFormData) => {
    if (!coordinates) return;

    const coordinatesString = `${coordinates[1]}, ${coordinates[0]}`;
    const plotData: CreateColumbariumRequest = {
      ...data,
      coordinates: coordinatesString,
    };

    toast.promise(createColumbariumMutation.mutateAsync(plotData), {
      loading: "Creating Columbarium plot...",
      success: "Columbarium plot created successfully!",
      error: "Failed to create plot. Please try again.",
    });
  };

  // 🚫 Handle cancel - clear forms and close
  const onCancel = () => {
    resetAllForms();
    onOpenChange(false);
  };

  // 🚫 Handle dialog close - reset forms and state
  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetAllForms();
    }
    onOpenChange(open);
  };

  return (
    <DialogStack open={open} onOpenChange={onDialogOpenChange}>
      <DialogStackOverlay />
      <DialogStackBody>
        {/* 🎯 First Dialog: Marker Type Selection */}
        <DialogStackContent index={0}>
          <DialogStackHeader>
            <DialogStackTitle>🎯 Select Marker Type</DialogStackTitle>
            {coordinates && (
              <p className="text-muted-foreground text-sm">
                📍 Location: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
              </p>
            )}
          </DialogStackHeader>

          <Form {...markerTypeForm}>
            <form onSubmit={markerTypeForm.handleSubmit(onMarkerTypeSelect)} className="space-y-4">
              <FormField
                control={markerTypeForm.control}
                name="markerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marker Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose marker type to add" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Serenity Lawn">🌿 Serenity Lawn</SelectItem>
                        <SelectItem value="Columbarium">🏺 Columbarium</SelectItem>
                        <SelectItem value="Memorial Chambers">🏛️ Memorial Chambers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogStackFooter>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <DialogStackNext asChild>
                  <Button type="submit">Continue</Button>
                </DialogStackNext>
              </DialogStackFooter>
            </form>
          </Form>
        </DialogStackContent>

        {/* � Second Dialog: Dynamic Form Based on Selection */}
        <DialogStackContent index={1}>
          <DialogStackHeader>
            <DialogStackTitle>
              {selectedMarkerType === "Serenity Lawn" && "🌿 Add Serenity Lawn Plot"}
              {selectedMarkerType === "Memorial Chambers" && "🏛️ Add Memorial Chambers"}
              {selectedMarkerType === "Columbarium" && "🏺 Add Columbarium"}
              {!selectedMarkerType && "🎯 Select Marker Type First"}
            </DialogStackTitle>
          </DialogStackHeader>

          {selectedMarkerType === "Serenity Lawn" && (
            <Form {...serenityLawnForm}>
              <form onSubmit={serenityLawnForm.handleSubmit(onSerenityLawnSubmit)} className="space-y-4">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <FormField
                      control={serenityLawnForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Bronze">🥉 Bronze</SelectItem>
                              <SelectItem value="Silver">🥈 Silver</SelectItem>
                              <SelectItem value="Platinum">⚪ Platinum</SelectItem>
                              <SelectItem value="Diamond">💎 Diamond</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormField
                      control={serenityLawnForm.control}
                      name="block"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Block</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select block" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">Block A</SelectItem>
                              <SelectItem value="B">Block B</SelectItem>
                              <SelectItem value="C">Block C</SelectItem>
                              <SelectItem value="D">Block D</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogStackFooter>
                  <DialogStackPrevious asChild>
                    <Button type="button" variant="outline">
                      Back
                    </Button>
                  </DialogStackPrevious>
                  <Button type="button" variant="outline" onClick={onCancel} disabled={createSerenityLawnMutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createSerenityLawnMutation.isPending || !coordinates}>
                    {createSerenityLawnMutation.isPending ? "Saving..." : "Save Plot"}
                  </Button>
                </DialogStackFooter>
              </form>
            </Form>
          )}

          {selectedMarkerType === "Memorial Chambers" && (
            <Form {...memorialChambersForm}>
              <form onSubmit={memorialChambersForm.handleSubmit(onMemorialChambersSubmit)} className="space-y-4">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <FormField
                      control={memorialChambersForm.control}
                      name="rows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rows</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number of rows" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormField
                      control={memorialChambersForm.control}
                      name="columns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Columns</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number of columns" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogStackFooter>
                  <DialogStackPrevious asChild>
                    <Button type="button" variant="outline">
                      Back
                    </Button>
                  </DialogStackPrevious>
                  <Button type="button" variant="outline" onClick={onCancel} disabled={createMemorialChambersMutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMemorialChambersMutation.isPending || !coordinates}>
                    {createMemorialChambersMutation.isPending ? "Saving..." : "Save Plot"}
                  </Button>
                </DialogStackFooter>
              </form>
            </Form>
          )}

          {selectedMarkerType === "Columbarium" && (
            <Form {...columbariumForm}>
              <form onSubmit={columbariumForm.handleSubmit(onColumbariumSubmit)} className="space-y-4">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <FormField
                      control={columbariumForm.control}
                      name="rows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rows</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number of rows" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormField
                      control={columbariumForm.control}
                      name="columns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Columns</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number of columns" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogStackFooter>
                  <DialogStackPrevious asChild>
                    <Button type="button" variant="outline">
                      Back
                    </Button>
                  </DialogStackPrevious>
                  <Button type="button" variant="outline" onClick={onCancel} disabled={createColumbariumMutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createColumbariumMutation.isPending || !coordinates}>
                    {createColumbariumMutation.isPending ? "Saving..." : "Save Plot"}
                  </Button>
                </DialogStackFooter>
              </form>
            </Form>
          )}

          {!selectedMarkerType && (
            <div className="py-8 text-center text-muted-foreground">
              <p>Please go back and select a marker type first.</p>
              <DialogStackFooter className="mt-4">
                <DialogStackPrevious asChild>
                  <Button type="button" variant="outline">
                    Back
                  </Button>
                </DialogStackPrevious>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </DialogStackFooter>
            </div>
          )}
        </DialogStackContent>
      </DialogStackBody>
    </DialogStack>
  );
}
