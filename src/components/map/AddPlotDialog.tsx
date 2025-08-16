import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createPlots } from "@/api/plots.api";
import type { CreatePlotRequest } from "@/types/map.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 🎯 Form validation schema
const AddPlotSchema = z.object({
  category: z.enum(["Bronze", "Silver", "Platinum", "Diamond", "Columbarium", "Chambers"], {
    message: "Category is required",
  }),
  length: z
    .string()
    .min(1, "Length is required")
    .regex(/^\d+\.?\d*$/, "Length must be a valid number"),
  width: z
    .string()
    .min(1, "Width is required")
    .regex(/^\d+\.?\d*$/, "Width must be a valid number"),
  area: z
    .string()
    .min(1, "Area is required")
    .regex(/^\d+\.?\d*$/, "Area must be a valid number"),
  block: z.string().min(1, "Block is required"),
});

type AddPlotFormData = z.infer<typeof AddPlotSchema>;

interface AddPlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: [number, number] | null;
}

export default function AddPlotDialog({ open, onOpenChange, coordinates }: AddPlotDialogProps) {
  const queryClient = useQueryClient();

  // 🔄 Form setup
  const form = useForm<AddPlotFormData>({
    resolver: zodResolver(AddPlotSchema),
    defaultValues: {
      category: undefined,
      length: "",
      width: "",
      area: "",
      block: "",
    },
  });

  // 🚀 Mutation for creating plot
  const createPlotMutation = useMutation({
    mutationFn: (data: CreatePlotRequest) => createPlots(data),
    onSuccess: () => {
      // 🔄 Refresh plots data
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      // 🎉 Close dialog and reset form
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating plot:", error);
    },
  });

  // 📤 Handle form submission with toast
  const onSubmit = (data: AddPlotFormData) => {
    if (!coordinates) return;

    // 📍 Format coordinates as "lng, lat" for database
    const coordinatesString = `${coordinates[1]}, ${coordinates[0]}`;

    const plotData: CreatePlotRequest = {
      ...data,
      coordinates: coordinatesString,
    };

    console.log("Submitting plot data:", plotData);

    // 🍞 Show promise toast
    toast.promise(createPlotMutation.mutateAsync(plotData), {
      loading: "Creating plot...",
      success: "Plot created successfully!",
      error: "Failed to create plot. Please try again.",
    });
  };

  // 🚫 Handle cancel - clear form and close
  const onCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  // 🧮 Auto-calculate area when length and width change
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "length" || name === "width") {
        const length = parseFloat(value.length || "0");
        const width = parseFloat(value.width || "0");

        if (length > 0 && width > 0) {
          const area = (length * width).toFixed(2);
          form.setValue("area", area);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>➕ Add New Plot</DialogTitle>
          {coordinates && (
            <p className="text-muted-foreground text-sm">
              📍 Location: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 📋 Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bronze">🥉 Bronze</SelectItem>
                      <SelectItem value="Silver">🥈 Silver</SelectItem>
                      <SelectItem value="Platinum">⚪ Platinum</SelectItem>
                      <SelectItem value="Diamond">💎 Diamond</SelectItem>
                      <SelectItem value="Columbarium">🏛️ Columbarium</SelectItem>
                      <SelectItem value="Chambers">🏛️ Chambers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 📏 Length Field */}
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (m)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="Enter length in meters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 📐 Width Field */}
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (m)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="Enter width in meters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 📊 Area Field (auto-calculated) */}
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Area (auto-calculated)" {...field} readOnly className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🔤 Block Field */}
            <FormField
              control={form.control}
              name="block"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Block</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter block identifier (e.g., A, B, C)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 🎯 Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={createPlotMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPlotMutation.isPending || !coordinates}>
                {createPlotMutation.isPending ? "Saving..." : "Save Plot"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
