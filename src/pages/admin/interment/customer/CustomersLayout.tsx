import CustomersPage from './CustomerPage'

export default function AdminIntermentCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h1 className="text-primary text-3xl font-bold">Customer Management</h1>
        <p className="text-muted-foreground text-lg">View, search, and manage your customer records.</p>
      </div>
      <CustomersPage />
    </div>
  )
}
