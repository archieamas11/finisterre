import { App, Block, Button, KonstaProvider, Navbar, Page } from 'konsta/react'

export default function iosLandingPage() {
  return (
    <KonstaProvider theme="ios" dark={false}>
      <App theme="ios">
        <Page>
          <Navbar title="Welcome iOS" />

          <Block strong className="text-center">
            <h1 className="mb-4 text-2xl font-bold">My iOS App</h1>
            <p className="mb-6 text-gray-600">Simple landing page for iOS using Konsta UI</p>
            <Button large tonal>
              Get Started
            </Button>
          </Block>
        </Page>
      </App>
    </KonstaProvider>
  )
}
