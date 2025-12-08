/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add other VITE_ variables here if you ever need them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
