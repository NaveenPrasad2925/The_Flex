/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOSTAWAY_CLIENT_ID: string
  readonly VITE_HOSTAWAY_CLIENT_SECRET: string
  readonly VITE_HOSTAWAY_TOKEN_URL: string
  readonly VITE_HOSTAWAY_BASE_URL: string
  readonly VITE_API_BASE_URL: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


