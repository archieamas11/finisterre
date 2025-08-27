import { MapPin, Search, Filter } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import MapPage from '@/layout/WebMapLayout'

export default function UserMap() {
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="mt-6">
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input placeholder="Search by name, plot number, or section..." className="w-full" />
            </div>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer">
              <Filter className="mr-1 h-3 w-3" />
              Available Plots
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              <Filter className="mr-1 h-3 w-3" />
              Occupied Plots
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              <Filter className="mr-1 h-3 w-3" />
              Reserved Plots
            </Badge>
            <Badge variant="secondary" className="cursor-pointer">
              <Filter className="mr-1 h-3 w-3" />
              My Family Plots
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card>
        <CardContent>
          <div className="mt-4 h-full w-full rounded-lg border p-2">
            <MapPage />
          </div>
        </CardContent>
      </Card>

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-500"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-500"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-500"></div>
              <span className="text-sm">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-500"></div>
              <span className="text-sm">My Family</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <MapPin className="mr-2 h-4 w-4" />
              Find My Family Plots
            </Button>
            <Button variant="outline" className="justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search Available Plots
            </Button>
            <Button variant="outline" className="justify-start">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Section
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
