import { App, KonstaProvider } from 'konsta/react'

import TabbarPage from '../components/mobile/AndroidTabbar'

export function AndroidLayout() {
  return (
    <KonstaProvider theme="ios" dark={false}>
      <App theme="ios">
        <TabbarPage />
      </App>
    </KonstaProvider>
  )
}
