import { memo } from 'react'

import { LOCATION_FEATURES } from './constants'

export const LocationFeatures = memo(function LocationFeatures() {
  return (
    <div className="lg:max-w-lg">
      <h3 className="text-3xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-4xl">Location Highlights</h3>
      <dl className="mt-10 space-y-8">
        {LOCATION_FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-start">
            <div className="flex-shrink-0">
              <div className="text-primary flex h-12 w-12 items-center justify-center rounded-lg bg-black/10">
                <feature.icon className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="ml-4">
              <dt className="text-md font-medium text-[var(--brand-primary)]">{feature.title}</dt>
              <dd className="mt-1 text-sm text-gray-600">{feature.description}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
})
