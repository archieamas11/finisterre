import { Card } from "@/components/ui/card";
import AdminMapLayout from "@/pages/admin/map4admin/AdminMapLayout";

export default function AdminMap() {
  // 🖼️ Prevent card and map from overflowing viewport
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 z-1 w-full" aria-label="Admin Map Page" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      <Card className="p-2 shadow-lg w-full" style={{ height: 'calc(97vh - 55px)', maxHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <AdminMapLayout />
      </Card>
    </div>
  );
}
