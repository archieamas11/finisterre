import { Building2, Heart, Shield, Infinity as InfinityIcon, Users, MapPin, Phone, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const coreValues = [
  {
    icon: Heart,
    title: 'Empathy',
    description: 'We act with empathy. We find joy in being there for you. We will do whatever we can to comfort you.',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/20',
  },
  {
    icon: Shield,
    title: 'Authenticity',
    description: 'We value authenticity. We do what we say we will do. We treasure what makes each one special.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: Users,
    title: 'Peace',
    description: 'We nurture peace. We give you peace of mind and of heart. We make you feel at home with us.',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    icon: InfinityIcon,
    title: 'Eternity',
    description: 'We believe in eternity. We honor how memories become legacies. We are pilgrims in our journey through forever.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    icon: Building2,
    title: 'Commitment',
    description: 'We offer you a lifetime commitment. We are all pilgrims who need each other. We will be there for you, always.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
  },
]

export default function About() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4">
            About Us
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Welcome to Finisterre</h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            The most exquisitely designed memorial estates in Cebu, inspired by the sacred pilgrimage routes of old.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Our Core Values</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">The principles that guide us in serving you with dedication and compassion</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((value) => {
            const Icon = value.icon
            return (
              <Card key={value.title} className="group transition-all hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-4 inline-flex rounded-lg p-3 ${value.bgColor}`}>
                    <Icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{value.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Our Company Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="secondary" className="mb-4">
              Our Company
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">Exquisitely Designed Memorial Estates</h2>
            <div className="text-muted-foreground space-y-4">
              <p className="leading-relaxed">
                The Finisterre brand stands for the most exquisitely designed memorial estates in Cebu. It is master-planned by the world-renowned{' '}
                <strong className="text-foreground">PALAFOX ASSOCIATES</strong> and developed by one of the country's top mining and development
                company, the <strong className="text-foreground">ANSECA Development Corporation</strong>.
              </p>
              <p className="leading-relaxed">
                The group has extensive experience in earthmoving and engineering, counting some of the country's top mining firms as clients for over
                30 years and thriving.
              </p>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="text-primary h-5 w-5" />
                Brand Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Inspired by the <strong className="text-foreground">Camino del Santiago de Compostela</strong>, one of the most significant pilgrimage
                routes in the Christian world in medieval times, Finisterre invites one to embark on a journey to a spiritual encounter with the
                divine, as in the Christian pilgrimages of old.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Developer & Permits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* About The Developer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="text-primary h-5 w-5" />
                About The Developer
              </CardTitle>
              <CardDescription>ANSECA Development Corporation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                One of the country's leading mining and development companies with over 30 years of experience in earthmoving and engineering. ANSECA
                brings unparalleled expertise in creating world-class memorial estates.
              </p>
            </CardContent>
          </Card>

          {/* Permits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" />
                Legal Permits & Certifications
              </CardTitle>
              <CardDescription>Fully licensed and certified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg border p-4">
                <p className="text-muted-foreground mb-1 text-sm font-medium">DHSUD License</p>
                <p className="font-semibold">LTS NO. 034495</p>
              </div>
              <div className="bg-muted/50 rounded-lg border p-4">
                <p className="text-muted-foreground mb-1 text-sm font-medium">Certificate of Registration</p>
                <p className="font-semibold">COR NO. 029922</p>
                <p className="text-muted-foreground mt-1 text-sm">Issued: July 3, 2019</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="from-primary/5 to-primary/10 mx-auto max-w-4xl border-2 bg-gradient-to-br">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Get In Touch</CardTitle>
            <CardDescription>We're here to answer your questions and provide support</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Address</h3>
                <p className="text-muted-foreground text-sm">Poblacion, Ward III, Minglanilla, Cebu</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                <Phone className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Contact Numbers</h3>
                <p className="text-muted-foreground text-sm">
                  Mobile: 0998 841 1173 | 0917 621 6823
                  <br />
                  Landline: 407 3099 | 254 3065
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer Note */}
      <section className="container mx-auto px-4 pb-16 text-center">
        <p className="text-muted-foreground text-sm">Copyright © {new Date().getFullYear()} Finisterre.ph. All rights reserved.</p>
      </section>
    </div>
  )
}
