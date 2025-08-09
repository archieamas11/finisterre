import { z } from "zod";
import React from "react";
import { toast } from "sonner";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Trash2, Edit3 } from "lucide-react";

import type { plots } from "@/types/map.types";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPlotsCategory } from "@/api/plots.api";
import { useEditPlots } from "@/hooks/plots-hooks/plot.hooks";
import {
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
  FormItem,
  Form,
} from "@/components/ui/form";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";

// 🧩 Zod schema for form validation
const editPlotSchema = z.object({
  label: z.string().optional(),
  file_name: z.array(z.string()).optional(),
  status: z.string().min(1, "Status is required"),
  category: z.string().min(1, "Category is required"),
  area: z.coerce.number().positive("Area must be positive"),
  width: z.coerce.number().positive("Width must be positive"),
  length: z.coerce.number().positive("Length must be positive"),
});

interface EditMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plots: {
    coordinates?: [number, number];
    file_name?: string[];
    plot_id: string;
    block?: string;
  } & Partial<EditPlotFormValues>;
}

type EditPlotFormValues = z.infer<typeof editPlotSchema>;

export default function EditMapDialog({
  open,
  plots,
  onOpenChange,
}: EditMapDialogProps) {
  const { isPending, mutateAsync } = useEditPlots();
  const [categories, setCategories] = React.useState<plots[]>([]);
  const [plotImages, setPlotImages] = React.useState<string[]>([]);

  // 🖼️ Initialize images from plot data
  React.useEffect(() => {
    console.log("🔍 Initializing images from plot data:", plots);
    if (plots.file_name && Array.isArray(plots.file_name)) {
      setPlotImages(plots.file_name.filter(Boolean));
    } else if (plots.file_name && typeof plots.file_name === "string") {
      setPlotImages([plots.file_name]);
    } else {
      setPlotImages([]);
    }
  }, [plots.file_name]);

  // 📋 Fetch categories when dialog opens
  React.useEffect(() => {
    if (!open) return;

    console.log("📋 Fetching plot categories...");
    getPlotsCategory()
      .then((res) => {
        // 🟢 Map string array to array of objects for Select compatibility
        const arr = Array.isArray(res?.categories)
          ? res.categories.map((cat: string) => ({ category: cat }))
          : [];
        setCategories(arr);
      })
      .catch((error) => {
        console.error("❌ Error fetching categories:", error);
        setCategories([]);
      });
  }, [open]);

  async function handleSubmit(values: EditPlotFormValues) {
    const payload: plots = {
      rows: "",
      columns: "",
      plot_id: plots.plot_id,
      file_names: plotImages, // Use current plotImages state
      block: plots.block || "",
      area: values.area.toString(),
      status: values.status.trim(),
      file_names_array: plotImages,
      width: values.width.toString(),
      category: values.category.trim(),
      length: values.length.toString(),
      label: (values.label ?? "").trim(),
      coordinates: plots.coordinates || [0, 0],
    };

    try {
      console.log("🔄 Updating plot with payload:", payload);
      const result = await mutateAsync(payload);
      console.log("✅ Plot updated successfully:", result);
      toast.success("Plot updated successfully!");

      // 🔄 Close dialog on successful update
      if ((result as any)?.success !== false) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("❌ Error updating plot:", error);
      toast.error("Failed to update plot. Please try again.");
    }
  }

  // 🛠 Ensure initialValues types match schema (numbers for length, width, area)
  const initialValues: EditPlotFormValues = {
    file_name: plotImages,
    label: plots.label ?? "",
    area: Number(plots.area) || 0,
    category: plots.category ?? "",
    width: Number(plots.width) || 0,
    length: Number(plots.length) || 0,
    status: plots.status ?? "available",
  };

  const form = useForm({
    mode: "onChange" as const,
    defaultValues: initialValues,
    resolver: zodResolver(editPlotSchema),
  });

  // 🔄 Reset form when plot data changes
  React.useEffect(() => {
    form.reset({
      file_name: plotImages,
      label: plots.label ?? "",
      area: Number(plots.area) || 0,
      category: plots.category ?? "",
      width: Number(plots.width) || 0,
      length: Number(plots.length) || 0,
      status: plots.status ?? "available",
    });
  }, [plots, plotImages, form]);

  // 🖼️ Image management functions
  const handleImageUpload = (file: File) => {
    if (plotImages.length >= 2) {
      console.log("⚠️ Maximum 2 images allowed");
      toast.warning("Maximum 2 images allowed per plot");
      return;
    }

    // 🔍 Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // 📏 Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const newImages = [...plotImages, imageUrl];
    setPlotImages(newImages);
    form.setValue("file_name", newImages);
    console.log("📸 Image uploaded:", imageUrl);
    toast.success("Image added successfully");
  };

  const handleImageRemove = (index: number) => {
    const newImages = plotImages.filter((_, i) => i !== index);
    setPlotImages(newImages);
    form.setValue("file_name", newImages);
    console.log("🗑️ Image removed at index:", index);
    toast.success("Image removed successfully");
  };

  const handleImageReplace = (index: number, file: File) => {
    // 🔍 Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // 📏 Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const newImages = [...plotImages];
    newImages[index] = imageUrl;
    setPlotImages(newImages);
    form.setValue("file_name", newImages);
    console.log("🔄 Image replaced at index:", index);
    toast.success("Image replaced successfully");
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="lg:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Plot</DialogTitle>
          <DialogDescription>Edit Plot Details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4s"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value || ""}
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* 🟢 Only render SelectItem if categories are loaded and valid */}
                          {categories.length === 0 ? (
                            // ⚠️ Do not render a SelectItem with empty value
                            <div className="px-3 py-2 text-sm text-gray-500">
                              Loading categories...
                            </div>
                          ) : (
                            categories
                              .filter(
                                (category) =>
                                  !!category.category &&
                                  category.category !== "",
                              )
                              .map((category, index) => (
                                <SelectItem
                                  value={category.category}
                                  key={index}
                                >
                                  {category.category}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="category"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Length<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={String(field.value || "")}
                        placeholder="Enter length"
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        type="number"
                        step="any"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="length"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Width<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={String(field.value || "")}
                        placeholder="Enter width"
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        type="number"
                        step="any"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="width"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Area<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        value={String(field.value || "")}
                        onChange={field.onChange}
                        placeholder="Enter area"
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        type="number"
                        step="any"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="area"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter status" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="status"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter label" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="label"
              />
              <FormField
                render={() => (
                  <FormItem>
                    <FormLabel>Media (Max 2 images)</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* 🖼️ Display existing images */}
                        {plotImages.length > 0 && (
                          <div className="grid w-full grid-cols-2 justify-between gap-2">
                            {plotImages.map((imageUrl, index) => (
                              <div
                                className="group relative w-full"
                                key={index}
                              >
                                <div className="flex h-30 w-full justify-between">
                                  <img
                                    className="border-border h-full w-full rounded-md border object-cover"
                                    alt={`Plot image ${index + 1}`}
                                    src={imageUrl}
                                  />
                                  {/* 🎯 Hover overlay with actions */}
                                  <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Dropzone
                                      onDrop={(acceptedFiles) => {
                                        const file = acceptedFiles[0];
                                        if (file) {
                                          handleImageReplace(index, file);
                                        }
                                      }}
                                      accept={{
                                        "image/*": [
                                          ".png",
                                          ".jpg",
                                          ".jpeg",
                                          ".webp",
                                        ],
                                      }}
                                      noClick={false}
                                      maxFiles={1}
                                    >
                                      {({ getRootProps, getInputProps }) => (
                                        <button
                                          className="rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                                          type="button"
                                          {...getRootProps()}
                                        >
                                          <input {...getInputProps()} />
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      )}
                                    </Dropzone>
                                    <button
                                      className="rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
                                      onClick={() => {
                                        handleImageRemove(index);
                                      }}
                                      type="button"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 🆕 Upload new image if less than 2 */}
                        {plotImages.length < 2 && (
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              const file = acceptedFiles[0];
                              if (file) {
                                handleImageUpload(file);
                              }
                            }}
                            accept={{
                              "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                            }}
                            maxFiles={1}
                          >
                            {({
                              getRootProps,
                              isDragActive,
                              isDragAccept,
                              isDragReject,
                              getInputProps,
                            }) => (
                              <div
                                {...getRootProps()}
                                className={cn(
                                  "focus:border-primary flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors hover:bg-gray-50 focus:outline-none",
                                  {
                                    "border-red-500 bg-red-50":
                                      isDragActive && isDragReject,
                                    "border-primary bg-blue-50":
                                      isDragActive && isDragAccept,
                                  },
                                )}
                              >
                                <input {...getInputProps()} />
                                <div className="p-4 text-center">
                                  <ImageIcon
                                    className="mx-auto mb-2 h-12 w-12 text-gray-400"
                                    strokeWidth={1.25}
                                  />
                                  <p className="text-sm text-gray-600">
                                    {isDragActive
                                      ? "Drop the image here..."
                                      : "Drag & drop an image here, or click to select"}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    {2 - plotImages.length} image
                                    {2 - plotImages.length !== 1
                                      ? "s"
                                      : ""}{" "}
                                    remaining
                                  </p>
                                </div>
                              </div>
                            )}
                          </Dropzone>
                        )}

                        {/* 📝 No images state */}
                        {plotImages.length === 0 && (
                          <p className="mt-2 text-center text-sm text-gray-500">
                            No images uploaded yet
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="file_name"
              />
            </div>
            <Button className="mt-10 w-full" disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
