import { SectionCards } from "@/components/sidebar/section-cards"
import { LayoutDashboardIcon } from "lucide-react"

export default function UserDashboard() {
  return (
    <div>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center gap-2 px-5 mb-5">
              <LayoutDashboardIcon strokeWidth={2.5} className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
            </div>
            <SectionCards />
          </div>
          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  )
}
