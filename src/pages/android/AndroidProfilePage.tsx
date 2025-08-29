import { Page, Navbar, Block, Link, Card, BlockTitle } from 'konsta/react'
import { ArrowLeft, User, Mail, Phone, Calendar } from 'lucide-react'

export default function AndroidProfilePage({ onBack }: { onBack: () => void }) {

  return (
    <Page>
      <Navbar
        title="Profile"
        subtitle="Finisterre Gardenz"
        left={
          <Link onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Link>
        }
      />

      <Block strong inset className="space-y-4">
        <BlockTitle>Profile Information</BlockTitle>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">John Doe</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">john.doe@example.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">January 2024</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <BlockTitle>Account Settings</BlockTitle>
          <div className="space-y-2">
            <Link className="flex items-center justify-between p-3 border rounded-lg">
              <span>Change Password</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
            <Link className="flex items-center justify-between p-3 border rounded-lg">
              <span>Privacy Settings</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
            <Link className="flex items-center justify-between p-3 border rounded-lg text-red-600">
              <span>Logout</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </Card>
      </Block>
    </Page>
  )
}
