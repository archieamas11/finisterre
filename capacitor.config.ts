import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.archieamas11.finisterre',
  appName: 'Finisterre Gardenz',
  webDir: 'dist',
  server: {
    // 🔐 Use HTTP scheme to prevent data loss on Android (cookies, localStorage)
    androidScheme: 'http',
    // ⚡ Allow cleartext traffic for development and HTTP API calls
    cleartext: true,
  },
  plugins: {
    // 🌐 Enable native HTTP plugin to replace axios/fetch with native implementation
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
