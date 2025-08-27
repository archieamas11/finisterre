import { MapPin, Search, Filter, ZoomIn, ZoomOut } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function UserMap() {
  return (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Memorial Park Map</h1>
          <p className="text-muted-foreground">Find and locate memorial plots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ZoomOut className="mr-2 h-4 w-4" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="mr-2 h-4 w-4" />
            Zoom In
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific plots or filter by criteria</CardDescription>
        </CardHeader>
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
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
          <CardDescription>Click on plots to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted border-muted-foreground/25 flex aspect-video items-center justify-center rounded-lg border-2 border-dashed">
            <div className="space-y-2 text-center">
              <MapPin className="text-muted-foreground mx-auto h-12 w-12" />
              <p className="text-muted-foreground">Interactive map will be displayed here</p>
              <p className="text-muted-foreground text-sm">Sample map showing cemetery layout</p>
            </div>
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
