import { Highlighter } from '@/components/ui/highlighter'
import { features } from './constants'
import { FeatureList } from './FeatureList'

export function FeatureSection() {
  return (
    <section id="features" aria-labelledby="features-heading" className="mt-20">
      <div className="landing-page-wrapper">
        {/* Feature section header */}
        <div className="group relative flex items-start">
          {/* Left content */}
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
            <div className="w-full lg:max-w-[720px]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                <span role="img" aria-label="dove">
                  🕊️
                </span>
                <span>Honoring Life, Celebrating Legacy</span>
              </div>
              <h2 className="mb-2 text-3xl leading-tight font-bold tracking-tight text-[var(--brand-primary)] sm:text-4xl lg:text-5xl xl:text-6xl">
                Why choose Finisterre Gardenz Memorial Park?
              </h2>
            </div>

            {/* Subtitle - stacks below on mobile, aligns bottom-right on desktop */}
            <div className="w-full text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:absolute lg:right-0 lg:bottom-0 lg:mb-4 lg:max-w-[480px]">
              A sacred place inspired by{' '}
              <Highlighter action="underline" color="#FF9800">
                El Camino de Santiago
              </Highlighter>
              , providing peace, dignity, and beauty for generations to come.
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:mt-16 lg:mx-0 lg:mt-20 lg:flex lg:max-w-none lg:gap-8">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row md:flex-col lg:flex-row">
            {features
              .filter((f) => f.image)
              .map((feature, index) => (
                <FeatureList key={feature.title} feature={feature} index={index} />
              ))}
          </div>
          <div className="flex w-full flex-col gap-4 lg:max-w-[340px]">
            {features
              .filter((f) => !f.image)
              .map((feature, index) => (
                <FeatureList key={feature.title} feature={feature} index={index + features.filter((f) => f.image).length} />
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
