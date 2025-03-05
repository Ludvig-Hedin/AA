/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  // Andra miljövariabler kan läggas till här
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 