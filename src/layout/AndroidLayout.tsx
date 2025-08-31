import { App, KonstaProvider } from 'konsta/react'

import AndroidHomepage from '@/components/mobile/AndroidHomepage'

export function AndroidLayout() {
  return (
    <KonstaProvider theme="ios">
      <App theme="ios" className="k-ios" materialTouchRipple={false}>
        <AndroidHomepage />
      </App>
    </KonstaProvider>
  )
}
