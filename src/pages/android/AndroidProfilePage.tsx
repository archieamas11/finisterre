import { Page, Navbar, Link } from 'konsta/react'
import { ArrowLeft } from 'lucide-react'

import UserProfile from '@/pages/user/UserProfile'

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

    <div className="py-4">
        <UserProfile />
      </div>
    </Page>
  )
}
