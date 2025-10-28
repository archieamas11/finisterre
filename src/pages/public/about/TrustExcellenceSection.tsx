import { Building2, FileText } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TrustExcellenceSection() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-5xl">Trust & Excellence</h2>
          <p className="text-lg leading-8 text-gray-800">Built on a foundation of expertise, integrity, and proper certification</p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* About The Developer */}
          <Card className="group border-white/50 bg-white/50 transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[var(--brand-primary)]">About The Developer</CardTitle>
              <CardDescription className="text-base">ANSECA Development Corporation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-gray-800">
                One of the country's leading mining and development companies with over 30 years of experience in earthmoving and engineering. ANSECA
                brings unparalleled expertise in creating world-class memorial estates.
              </p>
            </CardContent>
          </Card>

          {/* Permits */}
          <Card className="group border-white/50 bg-white/50 transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-[var(--brand-primary)]">Legal Permits & Certifications</CardTitle>
              <CardDescription className="text-base">Fully licensed and certified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-colors duration-200 hover:bg-slate-100/50">
                <p className="mb-1 text-sm font-medium text-gray-600">DHSUD License</p>
                <p className="font-semibold text-[var(--brand-primary)]">LTS NO. 034495</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-colors duration-200 hover:bg-slate-100/50">
                <p className="mb-1 text-sm font-medium text-gray-600">Certificate of Registration</p>
                <p className="font-semibold text-[var(--brand-primary)]">COR NO. 029922</p>
                <p className="mt-1 text-sm text-gray-600">Issued: July 3, 2019</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
