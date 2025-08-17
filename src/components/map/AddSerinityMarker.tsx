import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createPlots } from "@/api/plots.api";
import type { CreatePlotRequest } from "@/types/map.types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 🎯 Form validation schema
const AddPlotSchema = z.object({
  category: z.enum(["Bronze", "Silver", "Platinum", "Diamond", "Columbarium", "Chambers"], {
    message: "Category is required",
  }),
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
      block: "",
    },
  });

  // 🚀 Mutation for creating plot
  const createPlotMutation = useMutation({
    mutationFn: (data: CreatePlotRequest) => createPlots(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "chambers"] });
      queryClient.invalidateQueries({ queryKey: ["map-stats", "serenity"] });
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
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                {/* 📋 Category Field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
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
                {/* 🔤 Block Field */}
                <FormField
                  control={form.control}
                  name="block"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Block</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a block" />
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
