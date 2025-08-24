import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

function ToggleGroupItem({ size, variant, children, className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({
          size: context.size || size,
          variant: context.variant || variant,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className,
      )}
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

function ToggleGroup({ size, variant, children, className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn("group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs", className)}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ size, variant }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export { ToggleGroup, ToggleGroupItem };
