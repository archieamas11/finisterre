import { Card } from "@/components/ui/card";
import AdminMapLayout from "@/pages/admin/map4admin/AdminMapLayout";

export default function AdminMap() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 z-1 h-full w-full" aria-label="Admin Map Page">
      <Card className="p-2 shadow-lg w-full h-full">
        <AdminMapLayout />
      </Card>
    </div>
  );
}
