import { useEditPlots } from '@/hooks/plots-hooks/plot.hooks';
import type { plots } from "@/types/map.types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPlotsCategory } from '@/api/plots.api';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, Trash2, Edit3 } from 'lucide-react';
import Dropzone from 'react-dropzone';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 🧩 Zod schema for form validation
const editPlotSchema = z.object({
    category: z.string().min(1, "Category is required"),
    length: z.coerce.number().positive("Length must be positive"),
    width: z.coerce.number().positive("Width must be positive"),
    area: z.coerce.number().positive("Area must be positive"),
    status: z.string().min(1, "Status is required"),
    label: z.string().optional(),
    file_name: z.array(z.string()).optional(),
});

type EditPlotFormValues = z.infer<typeof editPlotSchema>;

interface EditMapDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plots: Partial<EditPlotFormValues> & {
        plot_id: string;
        file_name?: string[];
        block?: string;
        coordinates?: [number, number];
    };
}

export default function EditMapDialog({ open, onOpenChange, plots }: EditMapDialogProps) {
    const { mutateAsync, isPending } = useEditPlots();
    const [categories, setCategories] = React.useState<plots[]>([]);
    const [plotImages, setPlotImages] = React.useState<string[]>([]);

    // 🖼️ Initialize images from plot data
    React.useEffect(() => {
        console.log("🔍 Initializing images from plot data:", plots);
        if (plots.file_name && Array.isArray(plots.file_name)) {
            setPlotImages(plots.file_name.filter(Boolean));
        } else if (plots.file_name && typeof plots.file_name === 'string') {
            setPlotImages([plots.file_name]);
        } else {
            setPlotImages([]);
        }
    }, [plots.file_name]);

    // 📋 Fetch categories when dialog opens
    React.useEffect(() => {
        if (!open) return;

        console.log("📋 Fetching plot categories...");
        getPlotsCategory().then((res) => {
            // 🟢 Map string array to array of objects for Select compatibility
            const arr = Array.isArray(res?.categories)
                ? res.categories.map((cat: string) => ({ category: cat }))
                : [];
            setCategories(arr);
        }).catch((error) => {
            console.error("❌ Error fetching categories:", error);
            setCategories([]);
        });
    }, [open]);

    async function handleSubmit(values: EditPlotFormValues) {
        const payload: plots = {
            plot_id: plots.plot_id,
            block: plots.block || "",
            category: values.category.trim(),
            length: values.length.toString(),
            width: values.width.toString(),
            area: values.area.toString(),
            status: values.status.trim(),
            label: (values.label ?? "").trim(),
            coordinates: plots.coordinates || [0, 0],
            file_names: plotImages, // Use current plotImages state
            file_names_array: plotImages, // Include both for compatibility
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
        category: plots.category ?? "",
        length: Number(plots.length) || 0,
        width: Number(plots.width) || 0,
        area: Number(plots.area) || 0,
        status: plots.status ?? "available",
        label: plots.label ?? "",
        file_name: plotImages,
    };

    const form = useForm({
        resolver: zodResolver(editPlotSchema),
        defaultValues: initialValues,
        mode: "onChange" as const,
    });

    // 🔄 Reset form when plot data changes
    React.useEffect(() => {
        form.reset({
            category: plots.category ?? "",
            length: Number(plots.length) || 0,
            width: Number(plots.width) || 0,
            area: Number(plots.area) || 0,
            status: plots.status ?? "available",
            label: plots.label ?? "",
            file_name: plotImages,
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
        if (!file.type.startsWith('image/')) {
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
        form.setValue('file_name', newImages);
        console.log("📸 Image uploaded:", imageUrl);
        toast.success("Image added successfully");
    };

    const handleImageRemove = (index: number) => {
        const newImages = plotImages.filter((_, i) => i !== index);
        setPlotImages(newImages);
        form.setValue('file_name', newImages);
        console.log("🗑️ Image removed at index:", index);
        toast.success("Image removed successfully");
    };

    const handleImageReplace = (index: number, file: File) => {
        // 🔍 Validate file type
        if (!file.type.startsWith('image/')) {
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
        form.setValue('file_name', newImages);
        console.log("🔄 Image replaced at index:", index);
        toast.success("Image replaced successfully");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Edit Plot</DialogTitle>
                    <DialogDescription>Edit Plot Details</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4s">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            defaultValue={field.value || ""}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* 🟢 Only render SelectItem if categories are loaded and valid */}
                                                {categories.length === 0 ? (
                                                    // ⚠️ Do not render a SelectItem with empty value
                                                    <div className="px-3 py-2 text-sm text-gray-500">Loading categories...</div>
                                                ) : (
                                                    categories
                                                        .filter(category => !!category.category && category.category !== "")
                                                        .map((category, index) => (
                                                            <SelectItem key={index} value={category.category}>
                                                                {category.category}
                                                            </SelectItem>
                                                        ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                                control={form.control}
                                name="length"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Length<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                placeholder="Enter length"
                                                value={String(field.value || "")}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="width"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Width<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                placeholder="Enter width"
                                                value={String(field.value || "")}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Area<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                placeholder="Enter area"
                                                value={String(field.value || "")}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter status" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Label<span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter label" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="file_name"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Media (Max 2 images)</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {/* 🖼️ Display existing images */}
                                                {plotImages.length > 0 && (
                                                    <div className="grid grid-cols-2 gap-2 justify-between w-full">
                                                        {plotImages.map((imageUrl, index) => (
                                                            <div key={index} className="relative group w-full">
                                                                <div className="w-full h-30 flex justify-between">
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={`Plot image ${index + 1}`}
                                                                        className="border border-border w-full h-full rounded-md object-cover"
                                                                    />
                                                                    {/* 🎯 Hover overlay with actions */}
                                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
                                                                        <Dropzone
                                                                            onDrop={(acceptedFiles) => {
                                                                                const file = acceptedFiles[0];
                                                                                if (file) {
                                                                                    handleImageReplace(index, file);
                                                                                }
                                                                            }}
                                                                            accept={{
                                                                                "image/*": [".png", ".jpg", ".jpeg", ".webp"]
                                                                            }}
                                                                            maxFiles={1}
                                                                            noClick={false}
                                                                        >
                                                                            {({ getRootProps, getInputProps }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                                                                    {...getRootProps()}
                                                                                >
                                                                                    <input {...getInputProps()} />
                                                                                    <Edit3 className="h-4 w-4" />
                                                                                </button>
                                                                            )}
                                                                        </Dropzone>
                                                                        <button
                                                                            type="button"
                                                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                                                            onClick={() => handleImageRemove(index)}
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
                                                            "image/*": [".png", ".jpg", ".jpeg", ".webp"]
                                                        }}
                                                        maxFiles={1}
                                                    >
                                                        {({
                                                            getRootProps,
                                                            getInputProps,
                                                            isDragActive,
                                                            isDragAccept,
                                                            isDragReject,
                                                        }) => (
                                                            <div
                                                                {...getRootProps()}
                                                                className={cn(
                                                                    "w-full border-2 border-dashed flex items-center justify-center aspect-square rounded-md focus:outline-none focus:border-primary cursor-pointer hover:bg-gray-50 transition-colors",
                                                                    {
                                                                        "border-primary bg-blue-50": isDragActive && isDragAccept,
                                                                        "border-red-500 bg-red-50": isDragActive && isDragReject,
                                                                    }
                                                                )}
                                                            >
                                                                <input {...getInputProps()} />
                                                                <div className="text-center p-4">
                                                                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" strokeWidth={1.25} />
                                                                    <p className="text-sm text-gray-600">
                                                                        {isDragActive
                                                                            ? "Drop the image here..."
                                                                            : "Drag & drop an image here, or click to select"
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-1">
                                                                        {2 - plotImages.length} image{2 - plotImages.length !== 1 ? 's' : ''} remaining
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Dropzone>
                                                )}

                                                {/* 📝 No images state */}
                                                {plotImages.length === 0 && (
                                                    <p className="text-center text-sm text-gray-500 mt-2">
                                                        No images uploaded yet
                                                    </p>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full mt-10" disabled={isPending}>
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}