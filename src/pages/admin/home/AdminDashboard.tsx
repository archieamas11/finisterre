import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";

export default function UserDashboard() {
  return (
    <div className="w-full p-4 shadow-sm">
      <div className="@container/main flex flex-1 flex-col justify-between gap-4 py-4 md:gap-6">
        <SectionCards />
      </div>
      <ChartAreaInteractive />
    </div>
  );
}
