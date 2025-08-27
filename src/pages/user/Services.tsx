import { Heart, MapPin, FileText, Phone, Mail } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Services() {
  return (
    <div className="space-y-6">
      {/* Services Header */}
      <div className="text-center">
        <h1 className="text-foreground text-3xl font-bold">Memorial Services</h1>
        <p className="text-muted-foreground mt-2">Request and manage memorial services for your loved ones</p>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Memorial Services
            </CardTitle>
            <CardDescription>Traditional and contemporary memorial services</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Traditional Funeral Service</li>
              <li>• Memorial Service</li>
              <li>• Celebration of Life</li>
              <li>• Graveside Service</li>
            </ul>
            <Button className="mt-4 w-full" variant="outline">
              Request Service
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Plot Management
            </CardTitle>
            <CardDescription>Manage and maintain memorial plots</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Plot Maintenance</li>
              <li>• Headstone Installation</li>
              <li>• Floral Arrangements</li>
              <li>• Plot Transfers</li>
            </ul>
            <Button className="mt-4 w-full" variant="outline">
              Manage Plots
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Documentation
            </CardTitle>
            <CardDescription>Legal and administrative services</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Death Certificates</li>
              <li>• Burial Permits</li>
              <li>• Estate Documentation</li>
              <li>• Legal Assistance</li>
            </ul>
            <Button className="mt-4 w-full" variant="outline">
              View Documents
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Services</CardTitle>
          <CardDescription>Your recent service requests and history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">Memorial Service - Mary Johnson</h3>
                <p className="text-muted-foreground text-sm">Scheduled for October 15, 2025 • Plot 456, Section B</p>
              </div>
              <Badge variant="default">Confirmed</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">Plot Maintenance - Robert Smith</h3>
                <p className="text-muted-foreground text-sm">Completed on September 20, 2025 • Plot 789, Section C</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>Get in touch with our memorial services team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Phone className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">services@finisterre.com</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-muted-foreground text-sm">
              Our team is available Monday through Friday, 9 AM to 5 PM. For urgent matters outside business hours, please call our emergency line.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
