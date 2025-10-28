import CoreValuesSection from './CoreValuesSection'
import OurCompanySection from './OurCompanySection'
import TrustExcellenceSection from './TrustExcellenceSection'

export default function About() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 z-10 h-32 bg-gradient-to-b from-black/45 to-transparent"></div>
      <CoreValuesSection />
      <OurCompanySection />
      <TrustExcellenceSection />
    </div>
  )
}
