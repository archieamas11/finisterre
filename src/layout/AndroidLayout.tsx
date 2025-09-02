import { App, KonstaProvider } from 'konsta/react'

import AndroidHomepage from '@/components/mobile/AndroidHomepage'

export function AndroidLayout() {
  return (
    <KonstaProvider theme="ios" dark={true}>
      <App theme="ios" className="k-ios" dark={true}>
        <AndroidHomepage />
      </App>
    </KonstaProvider>
  )
}
