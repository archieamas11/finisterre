import React from "react";
import { BiMessageSquareEdit } from "react-icons/bi";
import { Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Customer, LotInfo } from "@/api/customer.api";
import CustomerForm from "@/pages/admin/interment/customer/CustomerForm";
import { editCustomer } from "@/api/customer.api";
import { calculateYearsBuried } from "@/utils/date.utils";

interface ViewCustomerDialogProps {
  open: boolean;
  customer: Customer;
  onOpenChange: (open: boolean) => void;
}

// Utility to format date strings for display
function formatDate(date?: string | null) {
  if (!date) {
    return "-";
  }

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Component for rendering deceased information
function DeceasedInfoCard({ deceased }: { deceased: any }) {
  return (
    <div className="bg-muted/30 space-y-2 rounded-lg border border-dashed p-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">👤</div>
        <div>
          <div className="text-sm font-medium">{deceased.dead_fullname}</div>
          <div className="text-muted-foreground text-xs">Deceased ID: {deceased.deceased_id}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Death Date:</span>
          <div className="font-medium">{formatDate(deceased.dead_date_death)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Interment:</span>
          <div className="font-medium">{formatDate(deceased.dead_interment)}</div>
        </div>
      </div>
      <div className="text-xs">
        <span className="text-muted-foreground">Years Buried:</span>
        <Badge variant="secondary" className="ml-2 text-xs">
          {calculateYearsBuried(deceased.dead_date_death)}
        </Badge>
      </div>
    </div>
  );
}

// Component for rendering combined property and deceased information
function PropertyDeceasedCard({ lot }: { lot: LotInfo }) {
  const hasGraveLot = lot.block != null && lot.block !== "" && lot.lot_plot_id != null;
  const hasNiche = lot.category != null && lot.category !== "" && lot.niche_number != null;
  const hasDeceased = Array.isArray(lot.deceased_info) && lot.deceased_info.length > 0;

  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      {/* Property Information Header */}
      <div className="border-b pb-2">
        <h4 className="flex items-center gap-2 text-sm font-medium">🏛️ Property Information</h4>
      </div>

      {/* Property Details */}
      <div className="space-y-2">
        {hasGraveLot && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded p-2 text-sm">🪦</div>
            <div>
              <div className="font-medium">Block {lot.block}</div>
              <div className="text-muted-foreground text-sm">Grave {lot.lot_plot_id}</div>
            </div>
          </div>
        )}

        {hasNiche && (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded p-2 text-sm">🏢</div>
            <div>
              <div className="font-medium">
                {lot.category} {lot.plot_id ?? ""}
              </div>
              <div className="text-muted-foreground text-sm">Niche {lot.niche_number}</div>
            </div>
          </div>
        )}
      </div>

      {/* Deceased Information Section */}
      <div className="space-y-3">
        <div className="border-b pb-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">👥 Deceased Information</h4>
        </div>

        {hasDeceased ? (
          <div className="space-y-3">
            {lot.deceased_info.map((deceased, idx) => (
              <DeceasedInfoCard key={`${deceased.deceased_id}-${idx}`} deceased={deceased} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/20 rounded-lg border border-dashed py-4 text-center">
            <p className="text-muted-foreground text-sm">No deceased records found for this property</p>
            <p className="text-muted-foreground mt-1 text-xs">This property is available for interment</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Section header component
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className="bg-border h-px flex-1" />
      <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">{title}</h3>
      <div className="bg-border h-px flex-1" />
    </div>
  );
}

// Info item component
function InfoItem({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
  return (
    <div>
      <div className="text-muted-foreground mb-1 text-xs">{label}</div>
      <div className="font-medium">
        {value !== undefined && value !== null ? value : "-"}
        {children}
      </div>
    </div>
  );
}

export default function ViewCustomer({ open, customer, onOpenChange }: ViewCustomerDialogProps) {
  if (!customer) {
    return null;
  }

  const [editOpen, setEditOpen] = React.useState(false);
  React.useEffect(() => {
    if (open) setEditOpen(false);
  }, [open]);

  return (
    <>
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
          {/* Profile Header */}
          <div className="bg-primary/5 relative flex flex-col items-center pt-12 pb-6">
            {/* Buttons in top right */}
            <div className="absolute top-2 left-2 flex gap-2">
              <Button
                aria-label="Edit customer"
                size="icon"
                variant="ghost"
                className="gap-1"
                onClick={() => {
                  setEditOpen(true);
                  onOpenChange(false);
                }}
              >
                <BiMessageSquareEdit />
              </Button>
              <Button aria-label="Print" size="icon" variant="ghost" className="gap-1">
                <Printer />
              </Button>
            </div>

            {/* Avatar */}
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full text-lg font-semibold">{customer.first_name.charAt(0)}</div>

            {/* Name */}
            <h2 className="mt-4 text-center text-xl font-bold tracking-tight">
              {customer.first_name}
              {customer.middle_name ? ` ${customer.middle_name}` : ""} {customer.last_name ? ` ${customer.last_name}` : ""}
            </h2>

            {/* Status Badges */}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="flex items-center gap-2 capitalize">
                Lot Owned
                <span className="bg-accent text-accent-foreground rounded-full border px-2 py-0.5 text-xs font-medium">{customer.lot_info?.length ?? 0}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 capitalize">
                Deceased
                <span className="bg-accent text-accent-foreground rounded-full border px-2 py-0.5 text-xs font-medium">
                  {customer.lot_info?.reduce((total, lot) => total + (Array.isArray(lot.deceased_info) ? lot.deceased_info.length : 0), 0) ?? 0}
                </span>
              </Badge>
              <Badge className="capitalize" variant="outline">
                {customer.gender}
              </Badge>
              <Badge className="capitalize" variant="outline">
                {customer.status}
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 p-5">
            {/* Contact Section */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Contact Information" />
              <div className="space-y-4">
                <InfoItem label="Email" value={customer.email} />
                <InfoItem label="Contact Number" value={customer.contact_number} />
                <InfoItem label="Address" value={customer.address} />
              </div>
            </div>

            {/* Personal Section */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Personal Details" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem label="Birth Date" value={formatDate(customer.birth_date)} />
                <InfoItem label="Occupation" value={customer.occupation} />
                <InfoItem label="Religion" value={customer.religion} />
                <InfoItem label="Citizenship" value={customer.citizenship} />
              </div>
            </div>

            {/* Property & Deceased Information - Combined */}
            <div className="bg-card rounded-lg border p-4">
              <SectionHeader title="Property & Deceased Information" />
              {Array.isArray(customer.lot_info) && customer.lot_info.length > 0 ? (
                <div className="space-y-4">
                  {customer.lot_info.map((lot, idx) => (
                    <PropertyDeceasedCard key={`${lot.plot_id}-${lot.niche_number}-${idx}`} lot={lot} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed py-6 text-center">
                  <p className="text-muted-foreground">No property information available</p>
                  <p className="text-muted-foreground mt-1 text-sm">This customer doesn't own any plots or niches</p>
                </div>
              )}
            </div>

            {/* Footer Dates */}
            <div className="text-muted-foreground flex justify-around text-center text-sm">
              <div>
                <div>Created</div>
                <div className="font-medium">{formatDate(customer.created_at)}</div>
              </div>
              <div>
                <div>Last Updated</div>
                <div className="font-medium">{formatDate(customer.updated_at)}</div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Dialog (outside Sheet so it stays mounted) */}
      <CustomerForm
        mode="edit"
        open={editOpen}
        initialValues={customer}
        onOpenChange={setEditOpen}
        onSubmit={async (values) => {
          await editCustomer(values as Customer);
        }}
      />
    </>
  );
}
