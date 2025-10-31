import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.archieamas11.finisterre',
  appName: 'Finisterre Gardenz',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    hostname: 'www.finisterre.site',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
